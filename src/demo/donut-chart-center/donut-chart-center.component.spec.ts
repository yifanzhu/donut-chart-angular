import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonutChartCenterComponent } from './donut-chart-center.component';

describe('DonutChartCenterComponent', () => {
  let component: DonutChartCenterComponent;
  let fixture: ComponentFixture<DonutChartCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonutChartCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonutChartCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
