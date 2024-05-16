import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoomsModalComponent } from './edit-rooms-modal.component';

describe('EditRoomsModalComponent', () => {
  let component: EditRoomsModalComponent;
  let fixture: ComponentFixture<EditRoomsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRoomsModalComponent]
    });
    fixture = TestBed.createComponent(EditRoomsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
