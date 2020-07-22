import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibModule } from '../lib/lib.module';

import { DemoComponent } from './demo.component';
import { DonutChartComponent } from '../lib/donut-chart/donut-chart.component';


@NgModule({
  declarations: [DemoComponent],
  imports: [
    CommonModule,
    LibModule
  ],
  entryComponents: [
    DonutChartComponent
  ],
  bootstrap: [DemoComponent]
})
export class DemoModule { }
