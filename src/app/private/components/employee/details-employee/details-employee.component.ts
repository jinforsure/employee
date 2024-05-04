import { Component, HostListener,ElementRef,Directive, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/private/model/employee';
import { EmployeeService } from 'src/app/private/services/employee.service';

@Component({
  selector: 'app-details-employee',
  templateUrl: './details-employee.component.html',
  styleUrls: ['./details-employee.component.css']
})
export class DetailsEmployeeComponent {

  employee : Employee ={firstName: '',lastName:'',phoneNumber:0,address:'',email:'',account_type:'Employee',department:'null',job:'',state:'' };
  departments: string[] = ['web','mobile'];
  account_types: string[]=['Employee','Technician','Admin'];
  states: string[] = ['Active', 'Inactive'];
  employeeId: string |null = null;
  @ViewChild('employeeForm') employeeForm!: NgForm;
  accountTypeInvalid: boolean = true;
  departmentInvalid: boolean = true;
  stateInvalid:boolean=true;
  saveDisabled: boolean = true;
  jobInvalid: boolean = true;

jobs: string[] = ['developper','HR'];

  constructor(
    private employeeService: EmployeeService ,
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
            this.employeeId = params.get('id');
            if (this.employeeId != null && this.employeeId != 'new') {
                this.displayEmployee(Number(this.employeeId));
            }
            console.log(this.employeeId);
        });
    }
    

  displayEmployee(id : number){
    this.employeeService.getEmployeeById(id).subscribe((res) =>
    {this.employee = res ;});
  }

  saveEmployee(){
    if (this.employee?.id){
      this.updateEmployee(this.employee?.id);
    }else {
      this.addEmployee();
    }
  }

  addEmployee() {
    this.employeeService.addEmployee(this.employee).subscribe((res) => { 
      this.router.navigate(['/employee']);
      console.log(res);});
  }

  updateEmployee (id: number){
    this.employeeService
    .editEmployee(id, this.employee)
    .subscribe((res) => {
      console.log(res);
      this.router.navigate(['/employee']);
    });
  }

  goBack(): void {
    this.router.navigate(['employee']);
  }


  checkFormValidity() {
    this.accountTypeInvalid = this.employeeForm.controls['account_type'].invalid && this.employeeForm.controls['account_type'].touched;
    this.departmentInvalid = this.employeeForm.controls['department'].invalid && this.employeeForm.controls['department'].touched;
    // Activer ou désactiver le bouton "Save" en fonction de la validité du formulaire
    this.saveDisabled = this.employeeForm.invalid || this.accountTypeInvalid || this.departmentInvalid;
  }

}