import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentaryComponent } from './momentary.component';

describe('MomentaryComponent', () => {
  let component: MomentaryComponent;
  let fixture: ComponentFixture<MomentaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomentaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MomentaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
