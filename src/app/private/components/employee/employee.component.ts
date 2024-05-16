import { Component } from '@angular/core';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalEmployeeComponent } from './modal-employee/modal-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../model/reservation';
import { AddEmployeeModalComponent } from './add-employee-modal/add-employee-modal.component';
import { EditEmployeeModalComponent } from './edit-employee-modal/edit-employee-modal.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {

  employeeList: Employee[] =[];
  searchText: string ='';
  filteredEmployeeList : Employee[] = [];
  reservationList: Reservation[] = [];
  matchingUsernames: string[] = [];

  constructor(private employeeService: EmployeeService,private dialog: MatDialog , private reservationService: ReservationService){}
  ngOnInit(): void {
    this.displayEmployee();
    this.displayReservations();
  }

  displayEmployee() {
    this.employeeService.getAllEmployee().subscribe((res) => {
      this.employeeList = res;
      this.filteredEmployeeList=res;
      console.log(res);
    });
  }

  selectedEmployee!: Employee ;

  selectEmployee(employee: any) {
    this.selectedEmployee = employee;
    console.log()
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


  displayReservations() {
    this.reservationService.getAllReservations().subscribe((reservations) => {
      this.reservationList = reservations;
      console.log(reservations);
  
      // Extract usernames from reservations
      const reservationUsernames = reservations.map((reservation) => reservation.username);
      console.log('Usernames:', reservationUsernames);
  
      // Get list of employee usernames that match reservation usernames
      this.matchingUsernames = this.employeeList
        .filter(employee => reservationUsernames.includes(employee.username)) // Filter employees by matching usernames
        .map(employee => employee.username) // Extract usernames
        .filter((username): username is string => !!username); // Filter out undefined values
  
      console.log('Employee usernames with matching reservations:', this.matchingUsernames);
  
      // Get reservations for each matching employee
      this.matchingUsernames.forEach(username => {
        const employeeReservations = this.reservationList.filter(reservation => reservation.username === username);
        console.log(`Reservations for employee ${username}:`, employeeReservations);
      });
    });
  }
  
  
  
  
  openEmployeeInfoModal(employee: any) {
    // Filter reservations by the selected employee's username
    const employeeReservations = this.reservationList.filter(reservation => reservation.username === employee.username);
  
    this.dialog.open(ModalEmployeeComponent, {
      data: {
        employee: employee,
        reservations: employeeReservations
      }
    });
  }
  

  hasReservations(usernames: string[]): boolean {
    // Check if any of the usernames have reservations
    return usernames.some(username =>
      this.reservationList.some(reservation => reservation.username === username)
    );
  }
  
  
  openAddEmployeeModal(): void {
    const dialogRef = this.dialog.open(AddEmployeeModalComponent, {
      width: '500px',
      // Add any other configuration options here
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Add logic to handle modal close if needed
    });
  }
  
  openAddEditEmployeeModal(employeeId :any, employee: any): void {
    const dialogRef = this.dialog.open(EditEmployeeModalComponent, {
      width: '500px',
      data: { employeeId, employee
       }
    });
    console.log("employee : ",employee);
    console.log("employee id: ",employeeId);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any necessary actions after the modal is closed
    });
  }

}
