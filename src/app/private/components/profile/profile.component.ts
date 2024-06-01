import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Employee } from '../../model/employee';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  employee: Employee = {
    firstName: '',
    lastName: '',
    phoneNumber: 0,
    address: '',
    email: '',
    account_type: 'Employee',
    department: 'null',
    job: '',
    state: ''
  };
  employeeId: string | null = null;
  updatedEmployee: Employee[] = [];
  @ViewChild('employeeForm') employeeForm!: NgForm;
  changesSaved: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
  ) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = event.target?.value;
    if (initialValue !== undefined) {
      this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
    }
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  ngOnInit(): void {
    // Retrieve employee ID from local storage
    const storedEmployeeId = localStorage.getItem('id');
    if (storedEmployeeId) {
      this.employeeId = storedEmployeeId;
      this.displayEmployee(Number(this.employeeId)); // Fetch employee details
    } else {
      console.log("Employee ID not found in local storage");
    }
  }

  displayEmployee(id: number) {
    this.employeeService.getEmployeeById(id).subscribe((res) => {
      this.employee = res;
      this.updateLocalStorageEmail(); // Update local storage with initial email
    });
    console.log(this.employee)
  }

  saveEmployee() {
    if (this.employee?.id) {
      this.updateEmployee(this.employee?.id);
      console.log(this.employee?.id)
    }
  }

  updateEmployee(id: number) {
    this.employeeService.editEmployee(id, this.employee).subscribe(updatedEmployee => {
      // Update this.employee with the updated data received from the server
      this.employee = updatedEmployee;
      console.log("Employee details updated successfully:", updatedEmployee);
      this.updateLocalStorageEmail(); // Update local storage email after saving
      window.location.reload();
      // Optionally, you can navigate to another route or perform any other action here
    });
  }

  @HostListener('ngModelChange', ['$event']) onNgModelChange(event: any) {
    this.updateLocalStorageEmail();
  }

  updateLocalStorageEmail() {
    if (this.employee.email) {
      localStorage.setItem('email', this.employee.email);
    }
  }
}
