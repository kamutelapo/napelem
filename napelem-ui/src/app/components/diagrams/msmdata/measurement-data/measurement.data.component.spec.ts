import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementDataComponent } from './measurement.data.component';

describe('MeasurementDataComponent', () => {
  let component: MeasurementDataComponent;
  let fixture: ComponentFixture<MeasurementDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasurementDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasurementDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
