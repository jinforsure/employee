import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeModalComponent } from './add-employee-modal.component';

describe('AddEmployeeModalComponent', () => {
  let component: AddEmployeeModalComponent;
  let fixture: ComponentFixture<AddEmployeeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmployeeModalComponent]
    });
    fixture = TestBed.createComponent(AddEmployeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
