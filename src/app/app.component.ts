import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidenavComponent } from "./sidenav/sidenav.component";
import { BodyComponent } from "./body/body.component";


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, SidenavComponent, BodyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'unfold';
  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(private router: Router) {}

  shouldShowSideNav() {
    const hiddenRoutes = ['/login', '/signup','/homepage' ];
    return !hiddenRoutes.includes(this.router.url);
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
