import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { DonutCenterContentDirective } from './donut-chart/donut-center-content.directive';

@NgModule({
  declarations: [
    DonutChartComponent,
    DonutCenterContentDirective
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    DonutChartComponent
  ],
  providers: []
})
export class LibModule { }
