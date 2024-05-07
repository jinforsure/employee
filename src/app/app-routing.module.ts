import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './private/components/login/login.component';
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component';
import { ForgotPasswordComponent } from './private/components/forgot-password/forgot-password.component';
import { NotFoundComponent } from './private/components/not-found/not-found.component';



const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, {
    path: '',
    component: EmployeeLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/employee-layout/employee-layout.module').then(m => m.AdminLayoutModule)
      }
    ],
  }, 
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
