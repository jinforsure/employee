import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter } from 'rxjs';
import { Location } from '@angular/common';
import { NotifService,AppNotification } from '../../services/notif.service';


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

  notifications :AppNotification[]=[];
  userItems = userItems;

  ngOnInit(): void {
    this.chackCanShowSearchOverlay(window.innerWidth);
    this.loadNotifications();
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

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private location: Location,private NotifService: NotifService) {
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
  private loadNotifications(): void {
    this.NotifService.getNotifications().subscribe(
      (data: AppNotification[]) => {
        this.notifications = data;
        console.log("notiff",this.notifications);
      },
      (error) => {
        console.error('Erreur lors du chargement des notifications', error);
      }
    );
  }
  navigateBack(): void {
    this.location.back();
}

}
