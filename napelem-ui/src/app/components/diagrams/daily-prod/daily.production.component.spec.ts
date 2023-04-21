import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyProductionComponent } from './daily.production.component';

describe('DailyProductionComponent', () => {
  let component: DailyProductionComponent;
  let fixture: ComponentFixture<DailyProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
