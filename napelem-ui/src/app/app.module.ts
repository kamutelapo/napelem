import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeeklyAvgDiagramComponent } from './components/diagrams/weekly-avg/weekly.avg.diagram.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomAreaChartStackedComponent } from './components/custom-charts/custom-stacked-area/custom.stacked.area.chart.component';
import { CustomLineChartComponent } from './components/custom-charts/custom-line-chart/custom-line-chart.component';
import { CustomLineSeriesComponent } from './components/custom-charts/custom-line-chart/custom-line-series.component';
import { CustomLineComponent } from './components/custom-charts/custom-line-chart/custom-line.component';
import { MeasurementDataComponent } from './components/diagrams/msmdata/measurement-data/measurement.data.component';
import { WeeklySaldoComponent } from './components/diagrams/weekly-saldo/weekly.saldo.component';

@NgModule({
  declarations: [
    AppComponent,
    WeeklyAvgDiagramComponent,
    CustomAreaChartStackedComponent,
    CustomLineChartComponent,
    CustomLineSeriesComponent,
    CustomLineComponent,
    MeasurementDataComponent,
    WeeklySaldoComponent,
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
