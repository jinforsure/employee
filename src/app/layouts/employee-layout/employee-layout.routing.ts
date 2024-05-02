import { Routes } from '@angular/router';
import { BenefitComponent } from 'src/app/private/components/benefit/benefit.component';
import { CalendarComponent } from 'src/app/private/components/calendar/calendar.component';
import { ChartsComponent } from 'src/app/private/components/charts/charts.component';
import { DashboardComponent } from 'src/app/private/components/dashboard/dashboard.component';
import { EmployeeComponent } from 'src/app/private/components/employee/employee.component';
import { HistoryComponent } from 'src/app/private/components/history/history.component';
import { ReservationComponent } from 'src/app/private/components/reservation/reservation.component';



export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'charts',      component: ChartsComponent },
    { path: 'history',      component: HistoryComponent },
    { path: 'calendar',      component: CalendarComponent },
    { path: 'employee',      component: EmployeeComponent },
    { path: 'benefit',      component: BenefitComponent },
    { path: 'reservation',   component: ReservationComponent },
];
