import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Equipments } from 'src/app/private/model/equipments';
import { EquipmentsService } from 'src/app/private/services/equipments.service';

@Component({
  selector: 'app-add-equipments-modal',
  templateUrl: './add-equipments-modal.component.html',
  styleUrls: ['./add-equipments-modal.component.css']
})
export class AddEquipmentsModalComponent {
  equipments : Equipments ={name: '',type:'',manufactuer:'',model:'',quantity:0,price:0,maintenance_status:'operational',state:'Enabled',checked:false, benefitId:1, category:'Equipments',departDate:new Date(),departHour:'',returnHour:'' };
  departments: string[] = ['web','mobile'];
  account_types: string[]=['equipments','Technician','Admin'];
  maintenance: string[]=['operational','under maintenance','damaged'];
  states: string[] = ['Enabled', 'Diabled'];
  equipmentsId: string |null = null;
  @ViewChild('equipmentsForm') equipmentsForm!: NgForm;
  quantityInvalid: boolean = true;
  priceInvalid: boolean = true;
  stateInvalid:boolean=true;
  saveDisabled: boolean = true;
  jobInvalid: boolean = true;
  types: String[]=['Computer Equipments','Security Equipments','Production Equipments','Audio Visuel','Cables'];

jobs: string[] = ['developper','HR'];

  constructor(
    private equipmentsService: EquipmentsService ,
    private el: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEquipmentsModalComponent>
      ){ }
  

      @HostListener('input', ['$event']) onInputChange(event: any) {
        const initialValue = this.el.nativeElement.value;
        this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
        if (initialValue !== this.el.nativeElement.value) {
          event.stopPropagation();
        }
      }
      ngOnInit(): void {
        this.equipmentsId = this.data.equipmentId;
        this.equipmentsId = this.data.equipmentId;
        console.log("employee : ", this.equipmentsId);
        console.log("employee : ", this.equipmentsId);
    }
    

  displayEquipments(id : number){
    this.equipmentsService.getEquipmentsById(id).subscribe((res) =>
    {this.equipments = res ;});
  }

  saveEquipments(){
      this.addEquipments();
  }

  addEquipments() {
    this.equipmentsService.addEquipments(this.equipments).subscribe((res) => { 
      console.log(res);
      window.location.reload();
      // If you want to reload the page after the request is successful
    });
    this.dialogRef.close();
  }

  checkFormValidity() {
    // Check if all fields have values
    if (this.equipments.name && this.equipments.type && this.equipments.manufactuer && this.equipments.model && this.equipments.price) {
      return true; // All fields are filled
    } else {
      return false; // Not all fields are filled
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
