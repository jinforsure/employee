import { Component, Input, OnInit } from '@angular/core';
import { InavbarData } from './sidebar.component';

@Component({
  selector: 'app-sublevel-menu',
  template: `
     <ul *ngIf="collapsed && data.items && data.items.length > 0" 
       class="sublevel-nav"
     >
      <li *ngFor="let item of data.items" class="sublevel-nav-item">
         <a class="sublevel-nav-link" 
           *ngIf="item.items && item.items.length > 0"
         >
           <i class="sublevel-link-icon fal fa-circle"></i>
           <span class="sublevel-link-text" *ngIf="collapsed">{{item.title}}</span>
           <i *ngIf="item.items && collapsed" class="menu-collapse-icon" 
             [ngClass]="!item.expanded ? 'fal fa-angle-right' : 'fal fa-angle-down'"></i>
        </a>

        <a class="sublevel-nav-link"
           *ngIf="!item.items || (item.items && item.items.length === 0)"
           [routerLink]="item.path"
           routerLinkActive="active-sublevel"
           [routerLinkActiveOptions]="{exact: true}"
         >
           <i class="sublevel-link-icon fal fa-circle"></i>
           <span class="sublevel-link-text" *ngIf="collapsed">{{item.title}}</span>
        </a>
        <div *ngIf="item.items && item.items.length >0">
          <app-sublevel-menu 
             [collapsed]="collapsed"
             [multiple]="multiple"
             ></app-sublevel-menu>
       </div>
      </li>
    </ul>
  `,
  styles: ['./sidebar.component.css']
})
export class SublevelMenuComponent implements OnInit {
  @Input() data: InavbarData = {
    path : '',
    icon: '',
    title: '',
    expanded : '',
    items: []
  }

  @Input() collapsed =false;
  @Input() animating : boolean | undefined;
  @Input() expanded : boolean | undefined;
  @Input() multiple: boolean =false;
  constructor() {}
  ngOnInit(): void {
  }
  

}
