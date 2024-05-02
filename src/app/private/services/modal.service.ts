import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalOpenSubject = new Subject<any>();

  constructor() { }

  // Method to open the modal
  openModal(data: any): void {
    this.modalOpenSubject.next(data);
  }

  // Method to listen to modal open events
  onModalOpen(): Observable<any> {
    return this.modalOpenSubject.asObservable();
  }
}
