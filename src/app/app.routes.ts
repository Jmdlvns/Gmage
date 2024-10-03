import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CreategalleryComponent } from './gallery/creategallery/creategallery.component';
import { GalleriesComponent } from './galleries/galleries.component';




export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    { title: "Login", path: '', component: LoginComponent }, 
    { title: "Login", path: 'login', component: LoginComponent },
    { title: "Signup", path: 'signup', component: SignupComponent },
    { title: "Gallery", path: 'gallery', component: GalleryComponent },
    { title: "Gallery", path: 'creategallery', component: CreategalleryComponent },
    { title: "Galleries", path: 'galleries', component: GalleriesComponent },

    

];

