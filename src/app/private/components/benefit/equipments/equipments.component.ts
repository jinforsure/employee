import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Equipments } from 'src/app/private/model/equipments';
import { EquipmentsService } from 'src/app/private/services/equipments.service';
import { AddEquipmentsModalComponent } from './add-equipments-modal/add-equipments-modal.component';
import { EditEmployeeModalComponent } from '../../employee/edit-employee-modal/edit-employee-modal.component';
import { EditEquipmentsModalComponent } from './edit-equipments-modal/edit-equipments-modal.component';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.css']
})
export class EquipmentsComponent {
  equipmentsList: Equipments[] =[];
  searchText: string = '';
  filteredEquipmentList: Equipments []=[];
  constructor(
    private equipmentsService: EquipmentsService,private dialog: MatDialog 
  ){}
  ngOnInit(): void {
    this.displayEquipments();
  }

  displayEquipments() {
    this.equipmentsService.getAllEquipments().subscribe((res) => {
      this.equipmentsList = res;
      this.filteredEquipmentList = res;
      console.log(res);
    });
  }

  search(): void {
    // Filtrer la liste d'employés en fonction du texte de recherche
    if (this.searchText.trim() === '') {
      // Si le champ de recherche est vide, réinitialiser filteredEmployeeList avec employeeList
      this.filteredEquipmentList = this.equipmentsList;
    } else {
      // Sinon, appliquer la recherche normalement
      this.filteredEquipmentList = this.equipmentsList.filter(equipment => {
        // Vérifier si employee.firstName, employee.lastName et employee.email ne sont pas undefined
        const model = equipment.model ? equipment.model.toLowerCase() : '';
        const name = equipment.name ? equipment.name.toLowerCase() : '';
        const reserved = equipment.reservation_State ? equipment.reservation_State.toLowerCase() : '';
        const taken=equipment.taken? equipment.taken.toLowerCase():'';
        const returned=equipment.returned? equipment.returned.toLowerCase():'';
        const type = equipment.type ? equipment.type.toLowerCase() : '';
    
        // Rechercher le texte dans firstName, lastName et email
        return (
          model.includes(this.searchText.toLowerCase()) ||
          name.includes(this.searchText.toLowerCase()) ||
          reserved.includes(this.searchText.toLowerCase()) ||
          taken.includes(this.searchText.toLowerCase()) ||
          returned.includes(this.searchText.toLowerCase()) ||
          type.includes(this.searchText.toLowerCase())
        );
      });
    }console.log('Filtered equipment List:', this.filteredEquipmentList);
  }

openAddEquipmentsModal(): void {
  const dialogRef = this.dialog.open(AddEquipmentsModalComponent, {
    width: '500px',
    // Add any other configuration options here
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // Add logic to handle modal close if needed
  });
}


openAddEditEquipmentsModal(equipmentId :any, equipment: any): void {
  const dialogRef = this.dialog.open(EditEquipmentsModalComponent, {
    width: '500px',
    data: { equipmentId, equipment
     }
  });
  console.log("employee : ",equipment);
  console.log("employee id: ",equipmentId);
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // Handle any necessary actions after the modal is closed
  });
}
}
