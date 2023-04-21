import { Component } from '@angular/core';
import { CommonChartBaseComponent } from '../common/common.chart.base.component';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SolarDataService } from '../../../services/solar.data.service';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';

@Component({
  selector: 'app-daily-production',
  templateUrl: './daily.production.component.html',
  styleUrls: ['./daily.production.component.css']
})
export class DailyProductionComponent extends CommonChartBaseComponent {
  title = "Napi termelés";

  public xAxisLabel = "Nap";
  public yAxisLabel = "Napi termelés";

  public noBarWhenZero = false;

  public showGridLines = true;

  public gradient = false;

  colorScheme: Color = {
    name: 'dailyProdColor',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['orange', 'mediumorchid'],
  };

  constructor(private solarDataService: SolarDataService, viewBoxCalculatorService: ViewBoxCalculatorService ) {
    super(viewBoxCalculatorService);

    this.multi = solarDataService.getDailyProductionSeries();
  }

  valueFormat(value: any) {
    return value + " kWh"
  }
}
