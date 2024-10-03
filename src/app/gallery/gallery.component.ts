import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  @ViewChild('imageCanvas', { static: false }) imageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imagePreview', { static: false }) imagePreview!: ElementRef<HTMLImageElement>;
  @ViewChild('cropArea', { static: false }) cropArea!: ElementRef<HTMLDivElement>;

  userDetails: any;
  userData: any = {};
  baseAPI: string = 'http://localhost/galleria/galleria-api';
  isModalOpen: boolean = false;
  isModalOpen2: boolean = false;
  selectedImage: any = null;
  userImages: any[] = [];
  comments: any[] = [];
  applyForm: any;
  tester:any;
  selectedFile: File | null = null;
  originalImageSrc: string = '';
  formData: FormData = new FormData();
  selectedImageIndex = 0;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private route: Router,
    private aRoute: ActivatedRoute,
    private cookieService: CookieService,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadGallery();
    });

    this.applyForm = this.fb.group({
      imgDesc: [''],
      img: [null, Validators.required],
      imgType: ['none', Validators.required]
    });
  }

  ngOnInit(): void {
  this.userDetails = JSON.parse(this.cookieService.get('user_details'));
  this.loadGallery();

  this.ds.getRequest("get-galleries").subscribe(
    (response: any) => {
      this.userImages = response;
      console.log("POSTS", this.userImages);

      // Fetch comments for the initially displayed image if there are any images
      if (this.userImages.length > 0) {
        this.selectedImage = this.userImages[0];
        this.fetchComments(this.selectedImage.imgID);
      }
    },
    (error) => {
      console.error('Error fetching galleries:', error);
    }
  );
}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = this.imageCanvas.nativeElement;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            this.originalImageSrc = e.target.result;
            this.applyFilter();
          }
        };
        img.src = e.target.result;
        this.imagePreview.nativeElement.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  applyFilter(): void {
    const canvas = this.imageCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const filter = this.applyForm.get('imgType')?.value || 'none';
      ctx.filter = this.getFilter(filter);
      const img = new Image();
      img.src = this.originalImageSrc;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        this.imagePreview.nativeElement.src = canvas.toDataURL();
      };
    }
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

  Insert(imgID:any): void {
    if (this.applyForm.invalid || !this.selectedFile) {
      return;
    }

    const canvas = this.imageCanvas.nativeElement;
    canvas.toBlob((blob) => {
      if (blob) {
        this.formData.append('imgDesc', this.applyForm.value.imgDesc);
        this.formData.append('userID', this.userDetails.userID);
        this.formData.append('imgID', imgID);
        this.formData.append('imgType', this.applyForm.value.imgType);
        this.formData.append('img', blob, this.selectedFile?.name || 'image.png');

        this.ds.sendRequestWithMedia('edit-image', this.formData).subscribe(
          (response) => {
            console.log('Application submitted successfully:', response);
            Swal.fire({
              title: "Edit Image Successfully",
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
          },
          (error) => {
            console.error('Error submitting application:', error);
          }
        );
      }
    }, 'image/png');
   
  }
  
  loadGallery(): void {
    this.ds.getRequestWithParams("get-data", { id: this.userDetails.userID }).subscribe(
      (response: any) => {
        this.userData = response;
        console.log('userData:', this.userData);
      },
      (error) => {
        console.error('Error :', error);
      }
    );
  }


  Delete(imageID: number): void {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
  
        this.ds.delete(imageID).subscribe(
          (response) => {
              console.log('Accomplishment deleted successfully:', response);
              // Reload the portfolio to reflect changes
             
              Swal.fire({
                title: "Deleted Successfully",
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
          },
          (error) => {
              console.error('Error deleting accomplishment:', error);
              if (error.status === 401) {
                  console.warn('Unauthorized access - redirecting to login');
                  this.route.navigateByUrl('/login'); // Or your login route
              }
          }
      );
  
        Swal.fire({
          title: "Deleted!",
          text: "Your Competition has been deleted.",
          icon: "success"
        });
      }
    });
  }
  DeleteComment(commentID: number): void {
  Swal.fire({
    title: "Are you sure to delete this comment?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      this.ds.deleteComment(commentID).subscribe(
        (response) => {
          console.log('Comment deleted successfully:', response);

          // Remove the deleted comment from the comments array
          this.comments = this.comments.filter(comment => comment.commentID !== commentID);

          Swal.fire({
            title: "Deleted Successfully",
            icon: "success"
          });
        },
        (error) => {
          console.error('Error deleting comment:', error);
          if (error.status === 401) {
            console.warn('Unauthorized access - redirecting to login');
            this.route.navigateByUrl('/login'); // Or your login route
          }
        }
      );
    }
  });
}
  reloadWindow(): void {
    window.location.reload();
  }
  openModal(img: any): void {
    this.selectedImage = img;
    this.isModalOpen = true;

    // Clear any previously stored image data
    localStorage.removeItem('selectedImage');

    this.ds.getRequestWithParams('get-comments', { imgID: img.imgID }).subscribe(
        (response: any) => {
          this.comments = response;
            // Assuming response.comments is an array of comment objects
            this.selectedImage.comments = response.comments ? response.comments.reverse() : [];
            localStorage.setItem('selectedImage', JSON.stringify(this.selectedImage));
            console.log('Fetched Comments:', this.selectedImage.comments);
            console.log("comments",response);
        },
        (error) => {
            console.error('Error fetching comments:', error);
        }
    );
}
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedImage = null;
  }



  openModal2(img: any): void {
    // this.selectedImage = img;
    this.isModalOpen2 = true;

    this.ds.getRequestWithParams('get-photo', { imgID: img.imgID }).subscribe(
      (response: any) => {
        this.comments = response;
      },
      (error) => {
          console.error('Error fetching comments:', error);
      }
  );
}


  closeModal2(img:any): void {
    this.isModalOpen2 = false;
  }
  previousImage(): void {
    this.selectedImageIndex = (this.selectedImageIndex - 1 + this.userData.images.length) % this.userData.images.length;
    this.selectedImage = this.userData.images[this.selectedImageIndex];
    this.fetchComments(this.selectedImage.imgID);
  }
  
  nextImage(): void {
    this.selectedImageIndex = (this.selectedImageIndex + 1) % this.userData.images.length;
    this.selectedImage = this.userData.images[this.selectedImageIndex];
    this.fetchComments(this.selectedImage.imgID);
  }
  
  selectImage(index: number): void {
    this.selectedImageIndex = index;
    this.selectedImage = this.userData.images[this.selectedImageIndex];
    this.fetchComments(this.selectedImage.imgID);
  }
  fetchComments(imgID: number): void {
    this.ds.getRequestWithParams('get-comments', { imgID: imgID }).subscribe(
      (response: any) => {
        this.comments = response;
          // Assuming response.comments is an array of comment objects
          this.selectedImage.comments = response.comments ? response.comments.reverse() : [];
          localStorage.setItem('selectedImage', JSON.stringify(this.selectedImage));
          console.log('Fetched Comments:', this.selectedImage.comments);
          console.log("comments",response);
      },
      (error) => {
          console.error('Error fetching comments:', error);
      }
  );
}}