import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreategalleryComponent } from './creategallery.component';

describe('CreategalleryComponent', () => {
  let component: CreategalleryComponent;
  let fixture: ComponentFixture<CreategalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreategalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreategalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
