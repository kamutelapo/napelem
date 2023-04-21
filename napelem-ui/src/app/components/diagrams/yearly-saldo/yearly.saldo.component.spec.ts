import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlySaldoComponent } from './yearly.saldo.component';

describe('YearlySaldoComponent', () => {
  let component: YearlySaldoComponent;
  let fixture: ComponentFixture<YearlySaldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlySaldoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlySaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
