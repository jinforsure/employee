import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './employee-layout.routing';
import { DashboardComponent } from 'src/app/private/components/dashboard/dashboard.component';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { EquipmentsComponent } from 'src/app/private/components/benefit/equipments/equipments.component';
import { RoomsComponent } from 'src/app/private/components/benefit/rooms/rooms.component';
import { ListreservComponent } from 'src/app/private/components/reservation/listreserv/listreserv.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { ProfileComponent } from 'src/app/private/components/profile/profile.component';
import { SettingsComponent } from 'src/app/private/components/settings/settings.component';
import { DetailsModalComponent } from 'src/app/private/components/benefit/equipments/details-modal/details-modal.component';
import { ModalEmployeeComponent } from 'src/app/private/components/employee/modal-employee/modal-employee.component';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete'
import { PastReservationsComponent } from 'src/app/private/components/past-reservations/past-reservations.component';
import { CustomModalComponent } from 'src/app/private/components/calendar/custom-modal/custom-modal.component';
import { AddEmployeeModalComponent } from 'src/app/private/components/employee/add-employee-modal/add-employee-modal.component';
import { EditEmployeeModalComponent } from 'src/app/private/components/employee/edit-employee-modal/edit-employee-modal.component';
import { AddEquipmentsModalComponent } from 'src/app/private/components/benefit/equipments/add-equipments-modal/add-equipments-modal.component';
import { EditEquipmentsModalComponent } from 'src/app/private/components/benefit/equipments/edit-equipments-modal/edit-equipments-modal.component';
import { AddRoomsModalComponent } from 'src/app/private/components/benefit/rooms/add-rooms-modal/add-rooms-modal.component';
import { EditRoomsModalComponent } from 'src/app/private/components/benefit/rooms/edit-rooms-modal/edit-rooms-modal.component';
import { ReservationAuthComponent } from 'src/app/private/components/reservation-auth/reservation-auth.component';
import { AuthModalComponent } from 'src/app/private/components/reservation-auth/auth-modal/auth-modal.component';
import { TechnicienComponent } from 'src/app/private/components/technicien/technicien/technicien.component';
import { MaintenanceRoomComponent } from 'src/app/private/components/technicien/technicien/maintenance-room/maintenance-room/maintenance-room.component';
import { MaintenanceEquipComponent } from 'src/app/private/components/technicien/technicien/maintenance-equip/maintenance-equip/maintenance-equip.component';
// import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common'; 
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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatRippleModule,
    MatSelectModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
   
  ],
  declarations: [
     DashboardComponent,
     EmployeeComponent,
     BenefitComponent,
     ReservationComponent,
     CalendarComponent,
     EquipmentsComponent,
     RoomsComponent,
     ListreservComponent,
     ProfileComponent,
     SettingsComponent,
     DetailsModalComponent,
     ModalEmployeeComponent,
     PastReservationsComponent,
     CustomModalComponent,
     AddEmployeeModalComponent,
     EditEmployeeModalComponent,
     AddEquipmentsModalComponent,
     EditEquipmentsModalComponent,
     AddRoomsModalComponent,
     EditRoomsModalComponent,
     ReservationAuthComponent,
     AuthModalComponent,
     TechnicienComponent,
     MaintenanceRoomComponent,
     MaintenanceEquipComponent,
  ],
  providers: [
    DatePipe // Ajoutez cette ligne
  ],
})

export class AdminLayoutModule {}
