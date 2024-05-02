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
  constructor(private employeeService: EmployeeService){}
  ngOnInit(): void {
    this.displayEmployee();
  }

  displayEmployee() {
    this.employeeService.getAllEmployee().subscribe((res) => {
      this.employeeList = res;
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

  

}
