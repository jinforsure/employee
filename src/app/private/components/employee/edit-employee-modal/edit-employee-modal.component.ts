import { Component, HostListener,ElementRef,Directive, ViewChild, Inject } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/private/model/employee';
import { EmployeeService } from 'src/app/private/services/employee.service';

@Component({
  selector: 'app-edit-employee-modal',
  templateUrl: './edit-employee-modal.component.html',
  styleUrls: ['./edit-employee-modal.component.css']
})
export class EditEmployeeModalComponent {
  employee : Employee ={firstName: '',lastName:'',phoneNumber:0,address:'',email:'',account_type:'Employee',department:'null',job:'',state:'' };
  departments: string[] = ['web','mobile','Security','Finance','Design'];
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
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditEmployeeModalComponent>
      ){ }
  

      @HostListener('input', ['$event']) onInputChange(event: any) {
        const initialValue = this.el.nativeElement.value;
        this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
        if (initialValue !== this.el.nativeElement.value) {
          event.stopPropagation();
        }
      }
      ngOnInit(): void {
        this.employeeId = this.data.employeeId;
        this.employee = this.data.employee;
        console.log("employee : ", this.employeeId);
        console.log("employee : ", this.employee);
    }
    

  displayEmployee(id : number){
    this.employeeService.getEmployeeById(id).subscribe((res) =>
    {this.employee = res ;});
  }

  saveEmployee(){
    const employeeId = this.data.employeeId;
    console.log("employe 1 : ", employeeId)
    if (employeeId) {
      this.updateEmployee(employeeId);
      console.log("employe 2 : ", employeeId)
    }
  }


  updateEmployee (id: number){
    console.log("employe 2 : ", this.employee)
    this.employeeService
    .editEmployee(id, this.employee)
    .subscribe((res) => {
      console.log(res);
      window.location.reload();
    });
    this.dialogRef.close();
  }

  checkFormValidity() {
    this.accountTypeInvalid = this.employeeForm.controls['account_type'].invalid && this.employeeForm.controls['account_type'].touched;
    this.departmentInvalid = this.employeeForm.controls['department'].invalid && this.employeeForm.controls['department'].touched;
    // Activer ou désactiver le bouton "Save" en fonction de la validité du formulaire
    this.saveDisabled = this.employeeForm.invalid || this.accountTypeInvalid || this.departmentInvalid;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
