import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySaldoComponent } from './weekly.saldo.component';

describe('WeeklySaldoComponent', () => {
  let component: WeeklySaldoComponent;
  let fixture: ComponentFixture<WeeklySaldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklySaldoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklySaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
