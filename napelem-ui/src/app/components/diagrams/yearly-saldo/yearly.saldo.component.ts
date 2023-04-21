import { Component } from '@angular/core';
import { SolarDataService } from '../../../services/solar.data.service';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonChartBaseComponent } from '../common/common.chart.base.component';

@Component({
  selector: 'app-yearly-saldo',
  templateUrl: './yearly.saldo.component.html',
  styleUrls: ['./yearly.saldo.component.css']
})
export class YearlySaldoComponent extends CommonChartBaseComponent {
  title = "Éves szaldó";

  public xAxisLabel = "Nap";
  public yAxisLabel = "Éves szaldó";

  public colorScheme: Color = {
    name: 'yearlySaldoScheme',
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
    this.multi = solarDataService.getYearlySaldoSeries();
    this.referenceLines = [
      { value: 0, name: '' },
    ];
  }
}
