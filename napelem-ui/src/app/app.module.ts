import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeeklyAvgDiagramComponent } from './components/diagrams/weekly-avg/weekly.avg.diagram.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomAreaChartStackedComponent } from './components/custom-charts/custom-stacked-area/custom.stacked.area.chart.component'

@NgModule({
  declarations: [
    AppComponent,
    WeeklyAvgDiagramComponent,
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
