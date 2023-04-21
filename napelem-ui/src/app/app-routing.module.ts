import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeeklyAvgDiagramComponent } from './components/diagrams/weekly-avg/weekly.avg.diagram.component';
import { WeeklySaldoComponent } from './components/diagrams/weekly-saldo/weekly.saldo.component';
import { YearlySaldoComponent } from './components/diagrams/yearly-saldo/yearly.saldo.component';
import { MeasurementDataComponent } from './components/diagrams/msmdata/measurement-data/measurement.data.component'
import { DailyProductionComponent } from './components/diagrams/daily-prod/daily.production.component';

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
    path: 'daily-prod',
    component: DailyProductionComponent
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
