import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { LoginComponent } from './private/components/login/login.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component';
import { ComponentsModule } from "./private/shared/shared.module";
import { ForgotPasswordComponent } from './private/components/forgot-password/forgot-password.component';
import { NotFoundComponent } from './private/components/not-found/not-found.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ResetPasswordComponent } from './private/components/reset-password/reset-password.component';



class CustomDateFormatter extends CalendarNativeDateFormatter{
  public override dayViewHour({ date,locale}: DateFormatterParams) : string{
    return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute: 'numeric'}).format(date);
  }

  public override weekViewHour({ date,locale}: DateFormatterParams) : string{
    return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute: 'numeric'}).format(date);
  }
}


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        EmployeeLayoutComponent,
        ForgotPasswordComponent,
        NotFoundComponent,
        ResetPasswordComponent, 
        
    ],
    providers: [
        { provide: CalendarDateFormatter, useClass: CustomDateFormatter }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        OverlayModule,
        CdkMenuModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        NgxMaterialTimepickerModule,
        MatCheckboxModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
        BrowserAnimationsModule,
        MatTableModule,
        MatIconModule,
        ComponentsModule,
        MatDialogModule,
        MatSnackBarModule
    ]
})
export class AppModule { }
