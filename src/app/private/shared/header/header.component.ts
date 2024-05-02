import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

export const notfications = [
  {
    icon: 'far fa-cloud-download',
    Subject: 'Download complete',
    description: 'lorem ipsum dolor sit amet, constructor.'
  },
  {
    icon: 'far fa-cloud-upload',
    Subject: 'upload complete',
    description: 'lorem ipsum dolor sit amet, constructor.'
  },
  {
    icon: 'far fa-trash',
    Subject: '350 MB trash files',
    description: 'lorem ipsum dolor sit amet, constructor.'
  }
];

export const userItems = [
  {
    icon: 'far fa-user',
    label: 'Profile'
  },
  {
    icon: 'far fa-cog',
    label: 'Settings'
  },
  {
    icon: 'far fa-unlock-alt',
    label: 'Lock screen'
  },
  {
    icon: 'far fa-power-off',
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
  constructor() {}

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

}
