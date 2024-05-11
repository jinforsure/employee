import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reservation } from 'src/app/private/model/reservation';
@Component({
  selector: 'app-modal-employee',
  templateUrl: './modal-employee.component.html',
  styleUrls: ['./modal-employee.component.css']
})
export class ModalEmployeeComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalEmployeeComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  employee = this.data.employee;
  reservations = this.data.reservations; 
  
}
