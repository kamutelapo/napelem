import { Component, ViewEncapsulation } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SolarDataService } from '../../../services/solar.data.service';
import { CommonChartBaseComponent, Tooltip } from '../common/common.chart.base.component';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UsageComponent extends CommonChartBaseComponent {
  title = "Energia használat";

  xAxisLabel = 'Nap';
  yAxisLabel = 'Fogyasztás - termelés';
  details = 'Usage';

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['green', 'royalblue', 'cornflowerblue'],
  };


  constructor(private solarDataService: SolarDataService, viewBoxCalculatorService: ViewBoxCalculatorService ) {
    super(viewBoxCalculatorService);

    this.multi = solarDataService.getUsageSeries();
    this.referenceLines = [
      { value: 0, name: ''}
    ];
  }

  valueFormat(value: any) {
    return value + " kWh"
  }

  override getToolTipText(tooltipItem: Tooltip): string {
    let result = '';
    if (tooltipItem.series !== undefined) {
      result += tooltipItem.series;
      result += ': ';
      if (tooltipItem.value !== undefined) {
        result += Math.abs(tooltipItem.value).toLocaleString("hu-HU") + " kWh";
      }
      return result;
    } else {
      return super.getToolTipText(tooltipItem);
    }
  }
}
