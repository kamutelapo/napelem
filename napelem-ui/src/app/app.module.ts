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
import { CustomBarChartComponent } from './components/custom-charts/custom-bar-chart/custom-bar-chart.component';
import { MeasurementDataComponent } from './components/diagrams/msmdata/measurement-data/measurement.data.component';
import { WeeklySaldoComponent } from './components/diagrams/weekly-saldo/weekly.saldo.component';
import { DailyProductionComponent } from './components/diagrams/daily-prod/daily.production.component';
import { YearlySaldoComponent } from './components/diagrams/yearly-saldo/yearly.saldo.component';
import { MonthlyProductionComponent } from './components/diagrams/monthly-prod/monthly.production.component';
import { UsageComponent } from './components/diagrams/usage/usage.component';
import { UsageDetailsComponent } from './components/details/usage/usage.details.component';
import { AvgWattsComponent } from './components/diagrams/avg-watts/avg.watts.component';
import { VoltagesComponent } from './components/diagrams/voltages/voltages.component';
import { AccumulatorComponent } from './components/diagrams/accumulator/accumulator.component';
import { ProductionConsumptionComponent } from './components/diagrams/prod-cons/production.consumption.component';
import { MomentaryComponent } from './components/diagrams/momentary/momentary.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WeeklyAvgDiagramComponent,
    CustomAreaChartStackedComponent,
    CustomLineChartComponent,
    CustomLineSeriesComponent,
    CustomLineComponent,
    CustomBarChartComponent,
    MeasurementDataComponent,
    WeeklySaldoComponent,
    DailyProductionComponent,
    YearlySaldoComponent,
    MonthlyProductionComponent,
    UsageComponent,
    UsageDetailsComponent,
    AvgWattsComponent,
    VoltagesComponent,
    AccumulatorComponent,
    ProductionConsumptionComponent,
    MomentaryComponent,
  ],
  imports: [
    NgxChartsModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
