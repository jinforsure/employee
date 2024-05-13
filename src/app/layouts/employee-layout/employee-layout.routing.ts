import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { BenefitComponent } from 'src/app/private/components/benefit/benefit.component';
import { DetailsEquipmentsComponent } from 'src/app/private/components/benefit/equipments/details-equipments/details-equipments.component';
import { EquipmentsComponent } from 'src/app/private/components/benefit/equipments/equipments.component';
import { DetailsRoomsComponent } from 'src/app/private/components/benefit/rooms/details-rooms/details-rooms.component';
import { RoomsComponent } from 'src/app/private/components/benefit/rooms/rooms.component';
import { CalendarComponent } from 'src/app/private/components/calendar/calendar.component';
import { DashboardComponent } from 'src/app/private/components/dashboard/dashboard.component';
import { DetailsEmployeeComponent } from 'src/app/private/components/employee/details-employee/details-employee.component';
import { EmployeeComponent } from 'src/app/private/components/employee/employee.component';
import { PastReservationsComponent } from 'src/app/private/components/past-reservations/past-reservations.component';
import { ProfileComponent } from 'src/app/private/components/profile/profile.component';
import { ListreservComponent } from 'src/app/private/components/reservation/listreserv/listreserv.component';
import { ReservationComponent } from 'src/app/private/components/reservation/reservation.component';
import { SettingsComponent } from 'src/app/private/components/settings/settings.component';



export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent},
    { path: 'calendar',      component: CalendarComponent },
    { path: 'employee',      component: EmployeeComponent,},
    { path: 'employee/:id', component:DetailsEmployeeComponent },
    { path: 'benefit',      component: BenefitComponent },
    { path: 'benefit/equipments', component: EquipmentsComponent},
    { path: 'benefit/equipments/:id', component:DetailsEquipmentsComponent},
    { path: 'benefit/rooms', component: RoomsComponent},
    { path: 'benefit/rooms/:id', component:DetailsRoomsComponent },
    { path: 'reservation',   component: ReservationComponent},
    { path: 'reservation/list',   component: ListreservComponent},
    { path: 'profile',   component: ProfileComponent},
    { path: 'settings',   component: SettingsComponent},
    { path: 'pastReservation',   component: PastReservationsComponent},
];
