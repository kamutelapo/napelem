import { Component } from '@angular/core';
import { SolarDataService } from '../../../services/solar.data.service';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonChartBaseComponent, Tooltip } from '../common/common.chart.base.component';

@Component({
  selector: 'app-weekly-saldo',
  templateUrl: './weekly.saldo.component.html',
  styleUrls: ['./weekly.saldo.component.css']
})
export class WeeklySaldoComponent extends CommonChartBaseComponent {
  title = "Heti szaldóátlag";

  public xAxisLabel = "Nap";
  public yAxisLabel = "Heti szaldó átlag";

  public colorScheme: Color = {
    name: 'saldoScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#0000FF']
  };

  valueFormat(value: any) {
    return value + " kWh"
  }

  constructor(private solarDataService: SolarDataService,
    viewBoxCalculatorService: ViewBoxCalculatorService) {
    super(viewBoxCalculatorService);
    this.multi = solarDataService.getWeeklySaldoSeries();
    this.referenceLines = [
      { value: 0, name: '' },
    ];
  }
}
