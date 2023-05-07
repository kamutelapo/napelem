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
  details = 'Callback';

  isWeekly = false;

  detailsClick = (state: boolean): void => {
    this.isWeekly = !this.isWeekly;
    this.selectChart();
  };

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['orange', 'mediumorchid'],
  };


  constructor(private solarDataService: SolarDataService, viewBoxCalculatorService: ViewBoxCalculatorService ) {
    super(viewBoxCalculatorService);

    this.selectChart();
    this.referenceLines = [
      { value: solarDataService.getAverageProduction(), name: 'Átlag ' + solarDataService.getAverageProduction().toLocaleString("hu-HU") + ' kWh' }
    ];
  }

  selectChart(): void {

    if(this.isWeekly) {
      this.yAxisLabel = "Havi átlagtermelés";
      this.multi = this.solarDataService.getMonthlyAverageProductionSeries();
      this.colorScheme = {
        name: 'myScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['limegreen', 'darkgreen'],
      };
    } else {
      this.yAxisLabel = "Heti átlagtermelés";
      this.multi = this.solarDataService.getWeeklyAverageProductionSeries();
      this.colorScheme = {
        name: 'myScheme',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['orange', 'mediumorchid'],
      };
    }
    this.title = this.yAxisLabel;
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
