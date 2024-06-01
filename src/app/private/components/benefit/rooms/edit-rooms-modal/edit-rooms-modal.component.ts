import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Rooms } from 'src/app/private/model/rooms';
import { RoomsService } from 'src/app/private/services/rooms.service';

@Component({
  selector: 'app-edit-rooms-modal',
  templateUrl: './edit-rooms-modal.component.html',
  styleUrls: ['./edit-rooms-modal.component.css']
})
export class EditRoomsModalComponent {
  rooms : Rooms ={name: '',type:'',location:'',capacity:0,maintenance_status:'',state:'',checked:false,benefitId:2, category:'Rooms',departDate:new Date(),departHour:'',returnHour:"" };
  states: string[] = ['Enabled', 'Disabled'];
  roomsId: string |null = null;
  @ViewChild('roomsForm') roomsForm!: NgForm;
  capacityInvalid: boolean = true;
  stateInvalid:boolean=true;
  saveDisabled: boolean = true;
  types: String[]=['Meeting Room','Conference Room','Reading Room'];


  constructor(
    private roomsService: RoomsService ,
    private el: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditRoomsModalComponent>
      ){ }

      @HostListener('input', ['$event']) onInputChange(event: any) {
        const initialValue = this.el.nativeElement.value;
        this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
        if (initialValue !== this.el.nativeElement.value) {
          event.stopPropagation();
        }
      }
  
      ngOnInit(): void {
        this.roomsId = this.data.roomsId;
        console.log("room id : ", this.roomsId);
    }
    

    displayRooms(id : number){
    this.roomsService.getRoomsById(id).subscribe((res) =>
    {this.rooms = res ;});
  }


  saveRooms(){
    const roomsId = this.data.roomsId;
    console.log("room 1 : ", roomsId)
    if (roomsId) {
      this.updateRooms(roomsId);
      console.log("room 2 : ", roomsId)
    }
  }


  updateRooms (id: number){
    console.log("employe 2 : ", this.rooms)
    this.roomsService
    .editRooms(id, this.rooms)
    .subscribe((res) => {
      console.log(res);
      window.location.reload();
    });
    this.dialogRef.close();
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  onMaintenanceStatusChange() {
    if (this.rooms.maintenance_status === 'damaged') {
      this.rooms.state = 'Disabled';
    } else {
      this.rooms.state = 'Enabled';
    }
  }
}
