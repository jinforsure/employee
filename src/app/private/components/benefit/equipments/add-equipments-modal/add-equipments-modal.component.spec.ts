import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEquipmentsModalComponent } from './add-equipments-modal.component';

describe('AddEquipmentsModalComponent', () => {
  let component: AddEquipmentsModalComponent;
  let fixture: ComponentFixture<AddEquipmentsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEquipmentsModalComponent]
    });
    fixture = TestBed.createComponent(AddEquipmentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
