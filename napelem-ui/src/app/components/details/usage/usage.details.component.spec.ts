import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageDetailsComponent } from './usage.details.component';

describe('MonthlyProductionDetailsComponent', () => {
  let component: UsageDetailsComponent;
  let fixture: ComponentFixture<UsageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsageDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
