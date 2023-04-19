import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyAvgDiagramComponent } from './weekly.avg.diagram.component';

describe('WeeklyAvgDiagramComponent', () => {
  let component: WeeklyAvgDiagramComponent;
  let fixture: ComponentFixture<WeeklyAvgDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyAvgDiagramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyAvgDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
