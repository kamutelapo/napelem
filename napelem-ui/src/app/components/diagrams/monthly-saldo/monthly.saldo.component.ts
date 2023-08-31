import { Component, ViewEncapsulation } from '@angular/core';
import { SolarDataService } from '../../../services/solar.data.service';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonChartBaseComponent } from '../common/common.chart.base.component';

@Component({
  selector: 'app-monthly-saldo',
  templateUrl: './monthly.saldo.component.html',
  styleUrls: ['./monthly.saldo.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MonthlySaldoComponent extends CommonChartBaseComponent {
  title = "Havi szaldóátlag";

  public xAxisLabel = "Nap";
  public yAxisLabel = "Havi szaldóátlag";

  public colorScheme: Color = {
    name: 'saldoScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#0000FF', '#008000']
  };

  valueFormat(value: any) {
    return value + " kWh"
  }

  constructor(private solarDataService: SolarDataService,
    viewBoxCalculatorService: ViewBoxCalculatorService) {
    super(viewBoxCalculatorService);
    this.multi = solarDataService.getMonthlySaldoSeries();
    this.referenceLines = [
      { value: 0, name: '' },
    ];
  }
}
