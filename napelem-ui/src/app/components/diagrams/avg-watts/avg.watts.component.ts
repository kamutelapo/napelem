import { Component, ViewEncapsulation } from '@angular/core';
import { CommonChartBaseComponent, Tooltip } from '../common/common.chart.base.component';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SolarDataService } from '../../../services/solar.data.service';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';

@Component({
  selector: 'app-avg-watts',
  templateUrl: './avg.watts.component.html',
  styleUrls: ['./avg.watts.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AvgWattsComponent extends CommonChartBaseComponent {
  title = "Időbeli eloszlás";

  xAxisLabel = 'Idő';
  yAxisLabel = 'Fogyasztás - termelés';

  colorScheme: Color = {
    name: 'wattsScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['cornflowerblue', 'green'],
  };

  constructor(private solarDataService: SolarDataService, viewBoxCalculatorService: ViewBoxCalculatorService ) {
    super(viewBoxCalculatorService);

    this.multi = solarDataService.getAvgWatts();
  }

  valueFormat(value: any) {
    return value + "W"
  }

  getToolTipTime(model: Tooltip[]): string {
    if(model.length > 0) {
      return model[0].name
    }
    return ""
  }


  override getToolTipText(tooltipItem: Tooltip): string {
    let result = '';
    if (tooltipItem.series !== undefined) {
      result += tooltipItem.series;
    } else {
      result += '???';
    }
    result += ': ';
    if (tooltipItem.value !== undefined) {
      result += tooltipItem.value.toLocaleString("hu-HU") + "W";
    }
    return result;
  }

}
