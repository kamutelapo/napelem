import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyProductionComponent } from './monthly.production.component';

describe('MonthlyProductionComponent', () => {
  let component: MonthlyProductionComponent;
  let fixture: ComponentFixture<MonthlyProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
