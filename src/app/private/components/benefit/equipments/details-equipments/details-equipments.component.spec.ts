import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEquipmentsComponent } from './details-equipments.component';

describe('DetailsEquipmentsComponent', () => {
  let component: DetailsEquipmentsComponent;
  let fixture: ComponentFixture<DetailsEquipmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsEquipmentsComponent]
    });
    fixture = TestBed.createComponent(DetailsEquipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
