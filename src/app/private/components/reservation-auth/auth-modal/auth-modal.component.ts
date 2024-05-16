import { Component, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reservation } from 'src/app/private/model/reservation';
import { ReservationService } from 'src/app/private/services/reservation.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent {
  constructor(    @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AuthModalComponent>,
  private reservationService: ReservationService
){}
  reservation : Reservation ={username: '',name:'',category:'',subCategory:'',departDate:'',departHour:'',returnHour:'',state:'' };
  reservationId: string |null = null;
  state: string |null = null;
  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.state = this.data.state;
    this.reservationId= this.data.reservationId
    console.log("state 2 : ", this.state);
    console.log("state id : ", this.reservationId);
}

displayEquipments(id : number){
  this.reservationService.getReservationById(id).subscribe((res) =>
  {this.reservation = res ;});
}


saveEmployee(){
const reservationId = this.data.reservationId;
console.log("employe 1 : ", reservationId)
if (reservationId) {
  this.updateEmployee(reservationId);
  console.log("employe 2 : ", reservationId)
}
}


updateEmployee (id: number){
console.log("employe 2 : ", this.reservation)
this.reservationService
.editReservation(id, this.reservation)
.subscribe((res) => {
  console.log(res);
  window.location.reload();
});
this.dialogRef.close();
}

}
