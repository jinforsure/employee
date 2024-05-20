import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceEquipComponent } from './maintenance-equip.component';

describe('MaintenanceEquipComponent', () => {
  let component: MaintenanceEquipComponent;
  let fixture: ComponentFixture<MaintenanceEquipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceEquipComponent]
    });
    fixture = TestBed.createComponent(MaintenanceEquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
