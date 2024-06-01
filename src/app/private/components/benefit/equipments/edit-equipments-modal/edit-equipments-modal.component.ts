import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipments } from 'src/app/private/model/equipments';
import { EquipmentsService } from 'src/app/private/services/equipments.service';

@Component({
  selector: 'app-edit-equipments-modal',
  templateUrl: './edit-equipments-modal.component.html',
  styleUrls: ['./edit-equipments-modal.component.css']
})
export class EditEquipmentsModalComponent {
  equipments : Equipments ={name: '',type:'',manufactuer:'',model:'',quantity:0,price:0,maintenance_status:'',state:'',checked:false, benefitId:1, category:'Equipments',departDate:new Date(),departHour:'',returnHour:''  };
  states: string[] = ['Enabled', 'Disabled'];
  equipmentsId: string |null = null;
  @ViewChild('equipmentsForm') equipmentsForm!: NgForm;
  stateInvalid:boolean=true;

  constructor(
    private equipmentsService: EquipmentsService ,
    private el: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditEquipmentsModalComponent>
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
    const equipmentId = this.data.equipmentId;
    console.log("employe 1 : ", equipmentId)
    if (equipmentId) {
      this.updateEquipments(equipmentId);
      console.log("employe 2 : ", equipmentId)
    }
  }


  updateEquipments (id: number){
    console.log("employe 2 : ", this.equipments)
    this.equipmentsService
    .editEquipments(id, this.equipments)
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
    if (this.equipments.maintenance_status === 'damaged') {
      this.equipments.state = 'Disabled';
    } else {
      this.equipments.state = 'Enabled';
    }
  }
}
