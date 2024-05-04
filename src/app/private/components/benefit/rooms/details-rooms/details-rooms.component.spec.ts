import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRoomsComponent } from './details-rooms.component';

describe('DetailsRoomsComponent', () => {
  let component: DetailsRoomsComponent;
  let fixture: ComponentFixture<DetailsRoomsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsRoomsComponent]
    });
    fixture = TestBed.createComponent(DetailsRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
