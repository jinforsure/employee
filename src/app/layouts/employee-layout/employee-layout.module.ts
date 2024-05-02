import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './employee-layout.routing';
import { DashboardComponent } from 'src/app/private/components/dashboard/dashboard.component';
import { ChartsComponent } from 'src/app/private/components/charts/charts.component';
import { HistoryComponent } from 'src/app/private/components/history/history.component';
import { EmployeeComponent } from 'src/app/private/components/employee/employee.component';
import { BenefitComponent } from 'src/app/private/components/benefit/benefit.component';
import { ReservationComponent } from 'src/app/private/components/reservation/reservation.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from 'src/app/private/components/calendar/calendar.component';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMaterialTimepickerModule,
    MatCheckboxModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    ReactiveFormsModule
  ],
  declarations: [
     DashboardComponent,
     ChartsComponent,
     HistoryComponent,
     EmployeeComponent,
     BenefitComponent,
     ReservationComponent,
     CalendarComponent
  ]
})

export class AdminLayoutModule {}
