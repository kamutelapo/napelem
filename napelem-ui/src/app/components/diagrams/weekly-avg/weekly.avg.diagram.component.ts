import { Component, ViewEncapsulation } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SolarDataService } from '../../../services/solar.data.service';
import { CommonChartBaseComponent, Tooltip } from '../common/common.chart.base.component';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';

@Component({
  selector: 'app-weekly-avg-diagram',
  templateUrl: './weekly.avg.diagram.component.html',
  styleUrls: ['./weekly.avg.diagram.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class WeeklyAvgDiagramComponent extends CommonChartBaseComponent {
  title = "Heti átlagtermelés";

  xAxisLabel = 'Nap';
  yAxisLabel = 'Heti átlagtermelés';
  details = 'MonthlyAvg';

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['orange', 'mediumorchid'],
  };


  constructor(private solarDataService: SolarDataService, viewBoxCalculatorService: ViewBoxCalculatorService ) {
    super(viewBoxCalculatorService);

    this.multi = solarDataService.getWeeklyAverageProductionSeries();
    this.referenceLines = [
      { value: solarDataService.getAverageProduction(), name: 'Átlag ' + solarDataService.getAverageProduction().toLocaleString("hu-HU") + ' kWh' }
    ];
  }

  valueFormat(value: any) {
    return value + " kWh"
  }

  getToolTipSum(model: Tooltip[]): string {
    let sum = 0
    model.forEach( (item) => {
      sum += item.value
    });
    return "Összes termelés: " + sum.toLocaleString("hu-HU") + " kWh"
  }
}
