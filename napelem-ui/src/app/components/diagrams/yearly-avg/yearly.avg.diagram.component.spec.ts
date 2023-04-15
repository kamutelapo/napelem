import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyAvgDiagramComponent } from './yearly.avg.diagram.component';

describe('YearlyAvgDiagramComponent', () => {
  let component: YearlyAvgDiagramComponent;
  let fixture: ComponentFixture<YearlyAvgDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyAvgDiagramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyAvgDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
