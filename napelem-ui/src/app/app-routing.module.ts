import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YearlyAvgDiagramComponent } from './components/diagrams/yearly-avg/yearly.avg.diagram.component';

const routes: Routes = [
  {
    path: 'yearly-avg',
    component: YearlyAvgDiagramComponent
  },
  {
    path: '',
    redirectTo: 'yearly-avg',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
