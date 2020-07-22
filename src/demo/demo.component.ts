import { Component, OnInit } from '@angular/core';
import { DonutChartCenterComponent } from './donut-chart-center/donut-chart-center.component';

@Component({
  selector: 'demo-root',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  donutChartOptions = {
    centerComponent: DonutChartCenterComponent,
    dataSet: [
      {
        data: 0.35,
        color: '#935FDD',
        labelText: 'Label Text 1',
        legendText: 'Legend Text 1'
      },
      {
        data: 0.4,
        labelText: 'Label Text 2',
        legendText: 'Legend Text 2'
      },
      {
        data: 0.25,
        labelText: 'Label Text 3',
        legendText: 'Legend Text 3'
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

  onClickArc(e) {
    alert(`Hi, this is arc: ${e.option.labelText}`);
  }

}
