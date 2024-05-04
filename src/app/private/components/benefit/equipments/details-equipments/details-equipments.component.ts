import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipments } from 'src/app/private/model/equipments';
import { EquipmentsService } from 'src/app/private/services/equipments.service';

@Component({
  selector: 'app-details-equipments',
  templateUrl: './details-equipments.component.html',
  styleUrls: ['./details-equipments.component.css']
})
export class DetailsEquipmentsComponent {
  equipments : Equipments ={name: '',type:'',manufactuer:'',model:'',quantity:0,price:0,maintenance_status:'',state:'',checked:false };
  departments: string[] = ['web','mobile'];
  account_types: string[]=['equipments','Technician','Admin'];
  states: string[] = ['Active', 'Inactive'];
  equipmentsId: string |null = null;
  @ViewChild('equipmentsForm') equipmentsForm!: NgForm;
  quantityInvalid: boolean = true;
  priceInvalid: boolean = true;
  stateInvalid:boolean=true;
  saveDisabled: boolean = true;
  jobInvalid: boolean = true;
  types: String[]=['Computer Equipments','Security Equipments','Production Equipments'];

jobs: string[] = ['developper','HR'];

  constructor(
    private equipmentsService: EquipmentsService ,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    
      ){ }
  

      @HostListener('input', ['$event']) onInputChange(event: any) {
        const initialValue = this.el.nativeElement.value;
        this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
        if (initialValue !== this.el.nativeElement.value) {
          event.stopPropagation();
        }
      }
      ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.equipmentsId = params.get('id');
            if (this.equipmentsId != null && this.equipmentsId != 'new') {
                this.displayEquipments(Number(this.equipmentsId));
            }
            console.log(this.equipmentsId);
        });
    }
    

  displayEquipments(id : number){
    this.equipmentsService.getEquipmentsById(id).subscribe((res) =>
    {this.equipments = res ;});
  }

  saveEquipments(){
    if (this.equipments?.id){
      this.updateEquipments(this.equipments?.id);
    }else {
      this.addEquipments();
    }
  }

  addEquipments() {
    this.equipmentsService.addEquipments(this.equipments).subscribe((res) => { 
      this.router.navigate(['/equipments']);
      console.log(res);});
  }

  updateEquipments (id: number){
    this.equipmentsService
    .editEquipments(id, this.equipments)
    .subscribe((res) => {
      console.log(res);
      this.router.navigate(['/benefit/equipments']);
    });
  }

  goBack(): void {
    this.router.navigate(['/benefit/equipments']);
  }


  checkFormValidity() {
    this.quantityInvalid = this.equipmentsForm.controls['quantity'].invalid && this.equipmentsForm.controls['quantity'].touched;
    this.priceInvalid = this.equipmentsForm.controls['price'].invalid && this.equipmentsForm.controls['price'].touched;
    // Activer ou désactiver le bouton "Save" en fonction de la validité du formulaire
    this.saveDisabled = this.equipmentsForm.invalid || this.quantityInvalid || this.priceInvalid;
  }

}