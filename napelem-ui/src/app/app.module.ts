import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { YearlyAvgDiagramComponent } from './components/diagrams/yearly-avg/yearly.avg.diagram.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomAreaChartStackedComponent } from './components/custom-charts/custom-stacked-area/custom.stacked.area.chart.component'

@NgModule({
  declarations: [
    AppComponent,
    YearlyAvgDiagramComponent,
    CustomAreaChartStackedComponent,
  ],
  imports: [
    NgxChartsModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
