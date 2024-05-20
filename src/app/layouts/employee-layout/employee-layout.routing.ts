import { Routes } from '@angular/router';
import { BenefitComponent } from 'src/app/private/components/benefit/benefit.component';
import { EquipmentsComponent } from 'src/app/private/components/benefit/equipments/equipments.component';
import { RoomsComponent } from 'src/app/private/components/benefit/rooms/rooms.component';
import { CalendarComponent } from 'src/app/private/components/calendar/calendar.component';
import { DashboardComponent } from 'src/app/private/components/dashboard/dashboard.component';
import { EmployeeComponent } from 'src/app/private/components/employee/employee.component';
import { PastReservationsComponent } from 'src/app/private/components/past-reservations/past-reservations.component';
import { ProfileComponent } from 'src/app/private/components/profile/profile.component';
import { ReservationAuthComponent } from 'src/app/private/components/reservation-auth/reservation-auth.component';
import { ListreservComponent } from 'src/app/private/components/reservation/listreserv/listreserv.component';
import { ReservationComponent } from 'src/app/private/components/reservation/reservation.component';
import { SettingsComponent } from 'src/app/private/components/settings/settings.component';
import { MaintenanceEquipComponent } from 'src/app/private/components/technicien/technicien/maintenance-equip/maintenance-equip/maintenance-equip.component';
import { MaintenanceRoomComponent } from 'src/app/private/components/technicien/technicien/maintenance-room/maintenance-room/maintenance-room.component';
import { TechnicienComponent } from 'src/app/private/components/technicien/technicien/technicien.component';
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent},
    { path: 'calendar',      component: CalendarComponent },
    { path: 'employee',      component: EmployeeComponent,},
    { path: 'benefit',      component: BenefitComponent },
    { path: 'benefit/equipments', component: EquipmentsComponent},
    { path: 'benefit/rooms', component: RoomsComponent},
    { path: 'reservation',   component: ReservationComponent},
    { path: 'reservation/list',   component: ListreservComponent},
    { path: 'profile',   component: ProfileComponent},
    { path: 'settings',   component: SettingsComponent},
    { path: 'pastReservation',   component: PastReservationsComponent},
    { path: 'reservationAuth',   component: ReservationAuthComponent},
    { path: 'technicien',   component: TechnicienComponent},
    { path: 'technicien/maintenance-room',   component: MaintenanceRoomComponent},
    { path: 'technicien/maintenance-equipment',   component: MaintenanceEquipComponent},
];
