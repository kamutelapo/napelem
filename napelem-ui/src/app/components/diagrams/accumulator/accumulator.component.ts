import { Component, ViewEncapsulation } from '@angular/core';
import { CommonChartBaseComponent } from '../common/common.chart.base.component';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SolarDataService } from '../../../services/solar.data.service';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';

@Component({
  selector: 'app-accumulator',
  templateUrl: './accumulator.component.html',
  styleUrls: ['./accumulator.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AccumulatorComponent extends CommonChartBaseComponent  {
  title = "Akkumulátor";

  public xAxisLabel = "Kapacitás";
  public yAxisLabel = "Felhasznált termelés";

  public noBarWhenZero = false;

  public showGridLines = true;

  public gradient = false;

  colorScheme: Color = {
    name: 'dailyProdColor',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['green'],
  };

  constructor(private solarDataService: SolarDataService, viewBoxCalculatorService: ViewBoxCalculatorService ) {
    super(viewBoxCalculatorService);

    this.multi = solarDataService.getAccumulator();
  }

  valueFormat(value: any) {
    return value + "%"
  }

}
