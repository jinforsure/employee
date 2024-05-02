import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './private/components/login/login.component';
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: EmployeeLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/employee-layout/employee-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  }, 
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
