import { Component, ViewEncapsulation } from '@angular/core';
import { SolarDataService } from '../../../services/solar.data.service';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonChartBaseComponent, Tooltip } from '../common/common.chart.base.component';

@Component({
  selector: 'app-voltages',
  templateUrl: './voltages.component.html',
  styleUrls: ['./voltages.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VoltagesComponent extends CommonChartBaseComponent {
  title = "Feszültségek";

  public xAxisLabel = "Óra";
  public yAxisLabel = "Feszültségek";

  public colorScheme: Color = {
    name: 'saldoScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#0000FF', '#008000']
  };

  valueFormat(value: any) {
    return value + "V"
  }

  constructor(private solarDataService: SolarDataService,
    viewBoxCalculatorService: ViewBoxCalculatorService) {
    super(viewBoxCalculatorService);
    this.multi = solarDataService.getMaxVoltages();
    this.referenceLines = [
      { value: 230 * 0.9, name: 'Min' },
      { value: 230 * 1.1, name: 'Max' },
    ];
    this.showRefLabels = true;
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
      result += tooltipItem.value.toLocaleString("hu-HU") + "V";
    }
    return result;
  }


}
