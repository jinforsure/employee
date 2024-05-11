import { Component } from '@angular/core';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {

  employeeList: Employee[] =[];
  searchText: string ='';
  filteredEmployeeList : Employee[] = [];
  constructor(private employeeService: EmployeeService){}
  ngOnInit(): void {
    this.displayEmployee();
  }

  displayEmployee() {
    this.employeeService.getAllEmployee().subscribe((res) => {
      this.employeeList = res;
      this.filteredEmployeeList=res;
      console.log(res);
    });
  }

  selectedEmployee!: Employee ;

  selectEmployee(employee : any ) {
    this.selectedEmployee = employee;
  }

  deleteEmployee(){
    if (this.selectedEmployee.id){
      this.employeeService
      .deleteEmployee(this.selectedEmployee.id)
      .subscribe((res) => {
        console.log(res);
        this.displayEmployee();
      });
    }
  }

  search(): void {
    // Filtrer la liste d'employés en fonction du texte de recherche
    if (this.searchText.trim() === '') {
      // Si le champ de recherche est vide, réinitialiser filteredEmployeeList avec employeeList
      this.filteredEmployeeList = this.employeeList;
    } else {
      // Sinon, appliquer la recherche normalement
      this.filteredEmployeeList = this.employeeList.filter(employee => {
        // Vérifier si employee.firstName, employee.lastName et employee.email ne sont pas undefined
        const firstName = employee.firstName ? employee.firstName.toLowerCase() : '';
        const lastName = employee.lastName ? employee.lastName.toLowerCase() : '';
        const email = employee.email ? employee.email.toLowerCase() : '';
    
        // Rechercher le texte dans firstName, lastName et email
        return (
          firstName.includes(this.searchText.toLowerCase()) ||
          lastName.includes(this.searchText.toLowerCase()) ||
          email.includes(this.searchText.toLowerCase())
        );
      });
    }console.log('Filtered Employee List:', this.filteredEmployeeList);
  }


}
