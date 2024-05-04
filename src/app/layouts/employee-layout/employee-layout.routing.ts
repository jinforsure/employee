import { Routes } from '@angular/router';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { EmployeeGuard } from 'src/app/guards/employee.guard';
import { BenefitComponent } from 'src/app/private/components/benefit/benefit.component';
import { DetailsEquipmentsComponent } from 'src/app/private/components/benefit/equipments/details-equipments/details-equipments.component';
import { EquipmentsComponent } from 'src/app/private/components/benefit/equipments/equipments.component';
import { DetailsRoomsComponent } from 'src/app/private/components/benefit/rooms/details-rooms/details-rooms.component';
import { RoomsComponent } from 'src/app/private/components/benefit/rooms/rooms.component';
import { CalendarComponent } from 'src/app/private/components/calendar/calendar.component';
import { ChartsComponent } from 'src/app/private/components/charts/charts.component';
import { ChatComponent } from 'src/app/private/components/chat/chat.component';
import { DashboardComponent } from 'src/app/private/components/dashboard/dashboard.component';
import { DetailsEmployeeComponent } from 'src/app/private/components/employee/details-employee/details-employee.component';
import { EmployeeComponent } from 'src/app/private/components/employee/employee.component';
import { HistoryComponent } from 'src/app/private/components/history/history.component';
import { ListreservComponent } from 'src/app/private/components/reservation/listreserv/listreserv.component';
import { ReservationComponent } from 'src/app/private/components/reservation/reservation.component';



export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent , canActivate: [AdminGuard]},
    { path: 'charts',      component: ChartsComponent },
    { path: 'history',      component: HistoryComponent },
    { path: 'calendar',      component: CalendarComponent, canActivate: [AdminGuard,EmployeeGuard] },
    { path: 'employee',      component: EmployeeComponent, canActivate: [AdminGuard] },
    { path: 'employee/:id', component:DetailsEmployeeComponent , canActivate: [AdminGuard]},
    { path: 'benefit',      component: BenefitComponent, canActivate: [AdminGuard] },
    { path: 'benefit/equipments', component: EquipmentsComponent , canActivate: [AdminGuard]},
    { path: 'benefit/equipments/:id', component:DetailsEquipmentsComponent , canActivate: [AdminGuard]},
    { path: 'benefit/rooms', component: RoomsComponent, canActivate: [AdminGuard] },
    { path: 'benefit/rooms/:id', component:DetailsRoomsComponent, canActivate: [AdminGuard] },
    { path: 'reservation',   component: ReservationComponent , canActivate: [EmployeeGuard]},
    { path: 'reservation/list',   component: ListreservComponent, canActivate: [EmployeeGuard] },
    { path: 'chat',   component: ChatComponent , canActivate: [EmployeeGuard]},
];
