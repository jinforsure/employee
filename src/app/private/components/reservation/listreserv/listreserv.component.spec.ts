import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListreservComponent } from './listreserv.component';

describe('ListreservComponent', () => {
  let component: ListreservComponent;
  let fixture: ComponentFixture<ListreservComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListreservComponent]
    });
    fixture = TestBed.createComponent(ListreservComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
