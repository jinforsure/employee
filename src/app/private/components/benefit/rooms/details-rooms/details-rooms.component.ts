import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Rooms } from 'src/app/private/model/rooms';
import { RoomsService } from 'src/app/private/services/rooms.service';

@Component({
  selector: 'app-details-rooms',
  templateUrl: './details-rooms.component.html',
  styleUrls: ['./details-rooms.component.css']
})
export class DetailsRoomsComponent {
  rooms : Rooms ={name: '',type:'',location:'',capacity:0,maintenance_status:'',state:'',checked:false };
  states: string[] = ['Active', 'Inactive'];
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
    
      ){ }
  
      ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.roomsId = params.get('id');
            if (this.roomsId != null && this.roomsId != 'new') {
                this.displayRooms(Number(this.roomsId));
            }
            console.log(this.roomsId);
        });
    }
    

    displayRooms(id : number){
    this.roomsService.getRoomsById(id).subscribe((res) =>
    {this.rooms = res ;});
  }

  saveRooms(){
    if (this.rooms?.id){
      this.updateRooms(this.rooms?.id);
    }else {
      this.addRooms();
    }
  }

  addRooms() {
    this.roomsService.addRooms(this.rooms).subscribe((res) => { 
      this.router.navigate(['/benefit/rooms']);
      console.log(res);});
  }

  updateRooms (id: number){
    this.roomsService
    .editRooms(id, this.rooms)
    .subscribe((res) => {
      console.log(res);
      this.router.navigate(['/benefit/rooms']);
    });
  }

  goBack(): void {
    this.router.navigate(['/benefit/rooms']);
  }


  checkFormValidity() {
    this.capacityInvalid = this.roomsForm.controls['capacity'].invalid && this.roomsForm.controls['capacity'].touched;
    // Activer ou désactiver le bouton "Save" en fonction de la validité du formulaire
    this.saveDisabled = this.roomsForm.invalid || this.capacityInvalid ;
  }

}

