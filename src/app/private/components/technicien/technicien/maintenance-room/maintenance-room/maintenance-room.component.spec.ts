import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRoomComponent } from './maintenance-room.component';

describe('MaintenanceRoomComponent', () => {
  let component: MaintenanceRoomComponent;
  let fixture: ComponentFixture<MaintenanceRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceRoomComponent]
    });
    fixture = TestBed.createComponent(MaintenanceRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
