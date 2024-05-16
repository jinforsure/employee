import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Rooms } from 'src/app/private/model/rooms';
import { RoomsService } from 'src/app/private/services/rooms.service';

@Component({
  selector: 'app-add-rooms-modal',
  templateUrl: './add-rooms-modal.component.html',
  styleUrls: ['./add-rooms-modal.component.css']
})
export class AddRoomsModalComponent {
  rooms : Rooms ={name: '',type:'',location:'',capacity:0,maintenance_status:'',state:'',checked:false,benefitId:2, category:'Rooms' };
  states: string[] = ['Enabled', 'Disabled'];
  roomsId: string |null = null;
  @ViewChild('roomsForm') roomsForm!: NgForm;
  capacityInvalid: boolean = true;
  stateInvalid:boolean=true;
  saveDisabled: boolean = true;
  types: String[]=['Meeting Room','Conference Room','Reading Room'];


  constructor(
    private roomsService: RoomsService ,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddRoomsModalComponent>
      ){ }
  
      ngOnInit(): void {
        this.roomsId = this.data.roomsId;
        this.rooms = this.data.rooms;
        console.log("employee : ", this.rooms);
        console.log("employee : ", this.roomsId);
    }
    

    displayRooms(id : number){
    this.roomsService.getRoomsById(id).subscribe((res) =>
    {this.rooms = res ;});
  }


  saveRooms(){
    this.addRooms();
}

addRooms() {
  this.roomsService.addRooms(this.rooms).subscribe((res) => { 
    console.log(res);
    window.location.reload();
    // If you want to reload the page after the request is successful
  });
  this.dialogRef.close();
}



  checkFormValidity() {
    this.capacityInvalid = this.roomsForm.controls['capacity'].invalid && this.roomsForm.controls['capacity'].touched;
    // Activer ou désactiver le bouton "Save" en fonction de la validité du formulaire
    this.saveDisabled = this.roomsForm.invalid || this.capacityInvalid ;
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
