import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from '../components/home/home.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    OverlayModule,
    CdkMenuModule,
    
  ],
  declarations: [
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
  ],
  exports: [
    SidebarComponent,
    HeaderComponent,
    HomeComponent
  ]
})
export class ComponentsModule { }
