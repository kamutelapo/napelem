import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementDataComponentComponent } from './measurement-data-component.component';

describe('MeasurementDataComponentComponent', () => {
  let component: MeasurementDataComponentComponent;
  let fixture: ComponentFixture<MeasurementDataComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasurementDataComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasurementDataComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
