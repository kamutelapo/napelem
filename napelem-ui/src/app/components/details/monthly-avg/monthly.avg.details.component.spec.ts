import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyAvgDetailsComponent } from './monthly-avg-details.component';

describe('MonthlyAvgDetailsComponent', () => {
  let component: MonthlyAvgDetailsComponent;
  let fixture: ComponentFixture<MonthlyAvgDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyAvgDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyAvgDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
