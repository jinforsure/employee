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
  employee : Employee ={firstName: '',lastName:'',phoneNumber:0,address:'',email:'',account_type:'Employee',department:'null',job:'',state:'' };
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
    }
  }


  updateEmployee (id: number){
    this.employeeService
    .editEmployee(id, this.employee)
    .subscribe((res) => {
      console.log(res);
      this.router.navigate(['/employee']);
    });
  }


}


