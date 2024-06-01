import { Component, HostListener, ElementRef, Directive, ViewChild, Inject } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/private/model/employee';
import { EmployeeService } from 'src/app/private/services/employee.service';
import { EmailService } from 'src/app/private/services/email.service';
import { NotifService, AppNotification } from 'src/app/private/services/notif.service';

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.css']
})
export class AddEmployeeModalComponent {
  employee: Employee = { firstName: '', lastName: '', phoneNumber: 0, address: '', email: '', account_type: 'Employee', department: 'null', job: '', state: 'Active' };
  departments: string[] = ['web', 'mobile', 'Security', 'Finance', 'Design'];
  account_types: string[] = ['Employee', 'Technician', 'Admin'];
  states: string[] = ['Active', 'Inactive'];
  employeeId: string | null = null;
  @ViewChild('employeeForm') employeeForm!: NgForm;
  accountTypeInvalid: boolean = true;
  departmentInvalid: boolean = true;
  stateInvalid: boolean = true;
  saveDisabled: boolean = true;
  jobInvalid: boolean = true;

  jobs: string[] = ['developer', 'HR'];

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private emailService: EmailService,
    private notifService: NotifService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEmployeeModalComponent>
  ) { }

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

  displayEmployee(id: number) {
    this.employeeService.getEmployeeById(id).subscribe((res) => { this.employee = res; });
  }

  saveEmployee() {
    if (this.employee?.id) {
      this.updateEmployee(this.employee?.id);
    } else {
      this.addEmployee();
    }
  }

  addEmployee(): void {
    this.employeeService.getAllEmployee().subscribe((employees) => {
      const emailExists = employees.some((emp) => emp.email === this.employee.email);
      const usernameExists = employees.some((emp) => emp.username === this.employee.username);

      if (emailExists || usernameExists) {
        this.snackBar.open('Email or username already exists!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });
      } else {
        this.employeeService.addEmployee(this.employee).subscribe((res) => {
          this.sendWelcomeEmail(this.employee.email!, this.employee.username!, this.employee.password!);
          window.location.reload();
        });
        this.dialogRef.close();
      }
    });
  }

  updateEmployee(id: number) {
    this.employeeService.editEmployee(id, this.employee).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/employee']);
    });
  }

  checkFormValidity() {
    this.accountTypeInvalid = this.employeeForm.controls['account_type'].invalid && this.employeeForm.controls['account_type'].touched;
    this.departmentInvalid = this.employeeForm.controls['department'].invalid && this.employeeForm.controls['department'].touched;
    this.saveDisabled = this.employeeForm.invalid || this.accountTypeInvalid || this.departmentInvalid;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  sendWelcomeEmail(email: string, username: string, password: string) {
    const to: string[] = [email];
    const cc: string[] = [];
    const subject = "Welcome to Our Company!";
    const body = `Dear ${username},\n\nYour account has been successfully created. Here are your login details:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information secure.\n\nBest regards,\nAdmin`;

    this.emailService.sendEmail(to, cc, subject, body).subscribe(
      response => {
        console.log('Email sent successfully', response);
        const newNotification: AppNotification = {
          date_envoi: new Date().toISOString().split('T')[0],
          heure: new Date().toLocaleTimeString(),
          type: 'Email',
          titre: subject,
          message: body
        };
        this.notifService.addNotification(newNotification).subscribe(
          notifResponse => {
            console.log('Notification stored successfully', notifResponse);
          },
          notifError => {
            console.error('Error storing notification', notifError);
          }
        );
      },
      error => {
        console.error('Error sending email', error);
      }
    );
  }
}
