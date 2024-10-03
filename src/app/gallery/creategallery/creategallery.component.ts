import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface InsertedImage {
  src: string;
  filter: string;
  name: string; // Add a name property
}

@Component({
  selector: 'app-creategallery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './creategallery.component.html',
  styleUrls: ['./creategallery.component.css']
})
export class CreategalleryComponent implements OnInit {
  @ViewChild('imageCanvas', { static: false }) imageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imagePreview', { static: false }) imagePreview!: ElementRef<HTMLImageElement>;
  @ViewChild('cropArea', { static: false }) cropArea!: ElementRef<HTMLDivElement>;
  applyForm: FormGroup;
  selectedFile: File | null = null;
  formData: FormData = new FormData();
  userDetails: any;
  originalImageSrc: string = '';
  insertedImages: InsertedImage[] = []; // Array to store the inserted images
  startX: number = 0;
  startY: number = 0;
  isDragging: boolean = false;
  cropStartX: number = 0;
  cropStartY: number = 0;
  cropWidth: number = 0;
  cropHeight: number = 0;
  userData: any = {};

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private route: Router,
    private aRoute: ActivatedRoute,
    private cookieService: CookieService,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {
    this.applyForm = this.fb.group({
      // imgDesc: [''],
      img: [null, Validators.required],
      imgType: ['none', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));
    // this.insertedImages.push({ src: 'https://via.placeholder.com/150', filter: 'none', name: 'placeholder.png' }); // Test image URL
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.insertedImages.push({ src: e.target.result, filter: 'none', name: file.name }); // Set the name property
          this.cdr.detectChanges(); // Detect changes manually
          this.applyForm.get('img')?.setValue(this.insertedImages);
        };
        reader.readAsDataURL(file);
      }
    }
    console.log(this.insertedImages);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  applyFilter(event: any, index: number): void {
    const filter = event.target.value;
    this.insertedImages[index].filter = this.getFilter(filter);
  }

  getFilter(filter: string): string {
    switch (filter) {
      case 'grayscale':
        return 'grayscale(100%)';
      case 'sepia':
        return 'sepia(100%)';
      case 'invert':
        return 'invert(100%)';
      case 'blur':
        return 'blur(5px)';
      case 'brightness':
        return 'brightness(150%)';
      case 'contrast':
        return 'contrast(150%)';
      case 'hue-rotate':
        return 'hue-rotate(90deg)';
      case 'saturate':
        return 'saturate(200%)';
      case 'opacity':
        return 'opacity(50%)';
      case 'drop-shadow':
        return 'drop-shadow(16px 16px 20px red)';
      case 'brightness-150':
        return 'brightness(150%)';
      case 'brightness-200':
        return 'brightness(200%)';
      case 'contrast-150':
        return 'contrast(150%)';
      case 'contrast-200':
        return 'contrast(200%)';
      case 'saturate-150':
        return 'saturate(150%)';
      case 'saturate-200':
        return 'saturate(200%)';
      default:
        return 'none';
    }
  }

  Insert(): void {
    if (this.applyForm.invalid || this.insertedImages.length === 0) {
      return;
    }
  
    let imagesProcessed = 0;
  
    this.insertedImages.forEach((image, index) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      img.src = image.src;
  
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = image.filter;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        canvas.toBlob((blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append('imgDesc', this.applyForm.value.imgDesc);
            formData.append('userID', this.userDetails.userID);
            formData.append('imgType', this.applyForm.value.imgType);
            formData.append('img', blob, `image${index}.png`);
  
            this.ds.sendRequestWithMedia('add-image', formData).subscribe(
              (response) => {
                console.log('Image submitted successfully:', response);
                imagesProcessed++;
                if (imagesProcessed === this.insertedImages.length) {
                  Swal.fire({
                    title: "Inserted Successfully",
                    icon: "success"
                  }).then(() => {
                    // Introduce a delay of 2 seconds before navigating to gallery
                    setTimeout(() => {
                      this.route.navigate(['/gallery']).then(() => {
                        // Reload the window after navigating to gallery
                        this.reloadWindow();
                      });
                    }, 500);
                  });
                }
              },
              (error) => {
                console.error('Error submitting image:', error);
              }
            );
          }
        }, 'image/png');
      };
    });
  }
  

  reloadWindow(): void {
    window.location.reload();
  }

  deleteImage(index: number): void {
    this.insertedImages.splice(index, 1);
    this.cdr.detectChanges(); // Detect changes manually
  }

  routeToGallery(): void {
    this.route.navigate([`../gallery`], { relativeTo: this.aRoute });
  }
}
