import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter } from 'rxjs';
import { Location } from '@angular/common';

export const notfications = [
  {
    icon: 'fal fa-cloud-download',
    Subject: 'Download complete',
    description: 'lorem ipsum dolor sit amet, constructor.'
  },
  {
    icon: 'fal fa-cloud-upload',
    Subject: 'upload complete',
    description: 'lorem ipsum dolor sit amet, constructor.'
  },
  {
    icon: 'fal fa-trash',
    Subject: '350 MB trash files',
    description: 'lorem ipsum dolor sit amet, constructor.'
  }
];

export const userItems = [
  {
    icon: 'fal fa-user',
    label: 'Profile'
  },
  {
    icon: 'fal fa-cog',
    label: 'Settings'
  },
  {
    icon: 'fal fa-power-off',
    label: 'Log out'
  },

]

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;

  notfifications = notfications;
  userItems = userItems;

  ngOnInit(): void {
    this.chackCanShowSearchOverlay(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event : any){
    this.chackCanShowSearchOverlay(window.innerWidth);
  }

  getHeadClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'head-trimmed';
    } else{
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  chackCanShowSearchOverlay(innerWidth: number): void{
    if(innerWidth <845){
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay= false;
    }
  }
  

  breadcrumbs: any[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {
    // Subscribe to router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Get the current route and its parent routes
      let route = this.activatedRoute.firstChild;
      this.breadcrumbs = [];
      while (route) {
        const routePath = route.snapshot.url.map(segment => segment.path);
        this.breadcrumbs.push({
          label: route.snapshot.data['breadcrumb'] || route.snapshot.url.map(segment => segment.path).join('/'),
          url: '/' + routePath.join('/')
        });
        route = route.firstChild;
      }
    });
  }

  navigateBack(): void {
    this.location.back();
}

}
