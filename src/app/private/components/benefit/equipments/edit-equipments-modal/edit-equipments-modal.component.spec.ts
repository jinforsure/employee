import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEquipmentsModalComponent } from './edit-equipments-modal.component';

describe('EditEquipmentsModalComponent', () => {
  let component: EditEquipmentsModalComponent;
  let fixture: ComponentFixture<EditEquipmentsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEquipmentsModalComponent]
    });
    fixture = TestBed.createComponent(EditEquipmentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
