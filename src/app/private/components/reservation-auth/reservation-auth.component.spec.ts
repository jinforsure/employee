import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAuthComponent } from './reservation-auth.component';

describe('ReservationAuthComponent', () => {
  let component: ReservationAuthComponent;
  let fixture: ComponentFixture<ReservationAuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationAuthComponent]
    });
    fixture = TestBed.createComponent(ReservationAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
