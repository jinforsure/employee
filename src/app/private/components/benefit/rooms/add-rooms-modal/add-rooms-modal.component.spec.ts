import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoomsModalComponent } from './add-rooms-modal.component';

describe('AddRoomsModalComponent', () => {
  let component: AddRoomsModalComponent;
  let fixture: ComponentFixture<AddRoomsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRoomsModalComponent]
    });
    fixture = TestBed.createComponent(AddRoomsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
