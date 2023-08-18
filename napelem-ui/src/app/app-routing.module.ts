import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeeklyAvgDiagramComponent } from './components/diagrams/weekly-avg/weekly.avg.diagram.component';
import { WeeklySaldoComponent } from './components/diagrams/weekly-saldo/weekly.saldo.component';
import { YearlySaldoComponent } from './components/diagrams/yearly-saldo/yearly.saldo.component';
import { MeasurementDataComponent } from './components/diagrams/msmdata/measurement-data/measurement.data.component'
import { DailyProductionComponent } from './components/diagrams/daily-prod/daily.production.component';
import { MonthlyProductionComponent } from './components/diagrams/monthly-prod/monthly.production.component';
import { UsageComponent } from './components/diagrams/usage/usage.component';
import { AvgWattsComponent } from './components/diagrams/avg-watts/avg.watts.component';
import { VoltagesComponent } from './components/diagrams/voltages/voltages.component';
import { AccumulatorComponent } from './components/diagrams/accumulator/accumulator.component';
import { ProductionConsumptionComponent } from './components/diagrams/prod-cons/production.consumption.component';
import { MomentaryComponent } from './components/diagrams/momentary/momentary.component';

const routes: Routes = [
  {
    path: 'weekly-avg',
    component: WeeklyAvgDiagramComponent
  },
  {
    path: 'weekly-saldo',
    component: WeeklySaldoComponent
  },
  {
    path: 'yearly-saldo',
    component: YearlySaldoComponent
  },
  {
    path: 'prod-cons',
    component: ProductionConsumptionComponent
  },
  {
    path: 'daily-prod',
    component: DailyProductionComponent
  },
  {
    path: 'monthly-prod',
    component: MonthlyProductionComponent
  },
  {
    path: 'momentary',
    component: MomentaryComponent
  },
  {
    path: 'usage',
    component: UsageComponent
  },
  {
    path: 'avg-watts',
    component: AvgWattsComponent
  },
  {
    path: 'voltages',
    component: VoltagesComponent
  },
  {
    path: 'accumulator',
    component: AccumulatorComponent
  },
  {
    path: 'msmdata',
    component: MeasurementDataComponent
  },
  {
    path: '',
    redirectTo: 'weekly-avg',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
