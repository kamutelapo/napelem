import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgWattsComponent } from './avg-watts.component';

describe('AvgWattsComponent', () => {
  let component: AvgWattsComponent;
  let fixture: ComponentFixture<AvgWattsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgWattsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvgWattsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
