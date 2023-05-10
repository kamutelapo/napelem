import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionConsumptionComponent } from './production-consumption.component';

describe('ProductionConsumptionComponent', () => {
  let component: ProductionConsumptionComponent;
  let fixture: ComponentFixture<ProductionConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionConsumptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
