import { Component } from '@angular/core';
import { Equipments } from 'src/app/private/model/equipments';
import { EquipmentsService } from 'src/app/private/services/equipments.service';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.css']
})
export class EquipmentsComponent {
  equipmentsList: Equipments[] =[];
  constructor(
    private equipmentsService: EquipmentsService,
  ){}
  ngOnInit(): void {
    this.displayEquipments();
  }

  displayEquipments() {
    this.equipmentsService.getAllEquipments().subscribe((res) => {
      this.equipmentsList = res;
      console.log(res);
    });
  }


}
