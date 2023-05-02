import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';
import { CommonChartBaseComponent, Tooltip } from '../../diagrams/common/common.chart.base.component';
import { SolarDataService } from 'src/app/services/solar.data.service';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-monthly-avg-details',
  templateUrl: './monthly.avg.details.component.html',
  styleUrls: ['./monthly.avg.details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MonthlyAvgDetailsComponent extends CommonChartBaseComponent {
  xAxisLabel = 'Nap';
  yAxisLabel = 'Havi átlagtermelés';

  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(private solarDataService: SolarDataService, viewBoxCalculatorService: ViewBoxCalculatorService) {
    super(viewBoxCalculatorService);

    this.multi = solarDataService.getMonthlyAverageProductionSeries();
  }

  colorScheme: Color = {
    name: 'monthlyAvgScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['limegreen', 'darkgreen'],
  };

  getMonthlyAvgDetailsClass() {
    let isMobile = this.viewBoxCalculatorService.isMobile();
    return isMobile ? "monthly-avg-details-mobile" : "monthly-avg-details-desktop";
  }

  closeDetails() {
    this.close.emit();
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

  override onResize(): void {
    super.onResize();
    this.legendPosition = LegendPosition.Below;

    let x;

    if( this.viewBoxCalculatorService.isMobile()) {
      x = window.innerWidth * 0.62
    } else {
      x = window.innerWidth * 0.7 - 200
    }

    this.view = [x, window.innerHeight * 0.58 - 90]
  }
}
