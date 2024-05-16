import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output , EventEmitter, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
export interface InavbarData {
  path : string;
  icon?: string;
  title: string;
  expanded? : string;
  items?: InavbarData[];
}
declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const navbarData : InavbarData[] = [
  { path: '/dashboard', title: 'Dashboard',  icon: 'fal fa-dashboard' },
  { path: '/calendar', title: 'Calendar',  icon: 'fal fa-calendar' },
  { path: '/employee', title: 'Employee',  icon: 'fal fa-user' },
  {
    path: '/benefit',
    title: 'Benefit',
    icon: 'fal fa-box-open',
    items: [
        {
            path: '/benefit/equipments',
            title: 'Equipments',
        },
        {
            path: '/benefit/rooms',
            title: 'Rooms',
        },
    ]
},
  { path: '/reservation', title: 'New Reservation',  icon: 'fal fa-bookmark' },
  { path: '/reservationAuth', title: 'Upcoming Reservations',  icon: 'fal fa-key' },
  { path: '/pastReservation', title: 'Past Reservations',  icon: 'fal fa-history' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity:0}),
        animate('350ms',
          style({opacity:1})
        )
      ]),
      transition(':leave', [
        style({opacity:1}),
        animate('350ms',
          style({opacity:0})
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'}),
      ])
        )
      ])
    ])
  ]
})
export class SidebarComponent  implements OnInit{

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth= 0;
  navData = navbarData;
  role : boolean =false;
  constructor (private service : AuthService, private router : Router) {}
  @HostListener('window:resize', ['$event'])
  onResize(event : any){
    if(this.screenWidth <= 768){
      this.collapsed =false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  ngOnInit(): void {
      this.screenWidth = window.innerWidth;
      this.onChecked();
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  onChecked() : void {
    if(this.service.getRole()=== "Admin"){
      this.role=true;
      console.log("cest admin");
    }else{
      this.role =false;
    }
  }
  
  logout(): void {
    this.service.logout();
    this.router.navigateByUrl('/login');
    console.log("fel logout sidebar");
  }
  
}
