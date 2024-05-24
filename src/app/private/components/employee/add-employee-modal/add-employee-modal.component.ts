import { Component, HostListener,ElementRef,Directive, ViewChild, Inject } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/private/model/employee';
import { EmployeeService } from 'src/app/private/services/employee.service';

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.css']
})
export class AddEmployeeModalComponent {
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
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEmployeeModalComponent>
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

  addEmployee(): void {
    // Fetch all employees from the backend
    this.employeeService.getAllEmployee().subscribe((employees) => {
      // Check if email or username already exists
      const emailExists = employees.some((emp) => emp.email === this.employee.email);
      console.log("email exists",emailExists)
      const usernameExists = employees.some((emp) => emp.username === this.employee.username);
      console.log("user exists",usernameExists)
      if (emailExists || usernameExists) {
        // If email or username already exists, show a message or handle accordingly
        this.snackBar.open('Email or username already exists!', 'Close', {
          duration: 3000, // Duration in milliseconds
          verticalPosition: 'top', // Position of the snackbar
        });
      } else {
        // If email and username are unique, proceed with adding employee
        this.employeeService.addEmployee(this.employee).subscribe((res) => {
          console.log(res);
          // If you want to reload the page after the request is successful
          window.location.reload();
        });
        this.dialogRef.close();
      }
    });
  }
  updateEmployee (id: number){
    this.employeeService
    .editEmployee(id, this.employee)
    .subscribe((res) => {
      console.log(res);
      this.router.navigate(['/employee']);
    });
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
