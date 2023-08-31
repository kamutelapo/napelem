import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySaldoComponent } from './monthly.saldo.component';

describe('MonthlySaldoComponent', () => {
  let component: MonthlySaldoComponent;
  let fixture: ComponentFixture<MonthlySaldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlySaldoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlySaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
