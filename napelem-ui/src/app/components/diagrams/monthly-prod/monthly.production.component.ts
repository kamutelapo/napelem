import { Component, ViewEncapsulation } from '@angular/core';
import { CommonChartBaseComponent } from '../common/common.chart.base.component';
import { SolarDataService } from '../../../services/solar.data.service';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-monthly-production',
  templateUrl: './monthly.production.component.html',
  styleUrls: ['./monthly.production.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MonthlyProductionComponent extends CommonChartBaseComponent {
  title = "Havi termelés";

  details = 'Callback';

  isPieChart = true;

  detailsClick = (state: boolean): void => {
    this.isPieChart = !this.isPieChart;
  };

  single: any;

  isDoughnut = false;
  gradient = false;

  constructor(private solarDataService: SolarDataService, viewBoxCalculatorService: ViewBoxCalculatorService) {
    super(viewBoxCalculatorService);

    this.single = solarDataService.getMonthlyProduction();
    this.multi = solarDataService.getMonthlyProductionSeries();
  }

  colorScheme: Color = {
    name: 'monthlyProdColor',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['rgb(190,30,46)', /*'rgb(240,65,54)',*/
      'rgb(241,90,43)',  /*'rgb(247,148,30)', 'rgb(43,56,144)',*/
      'rgb(28,117,188)', 'rgb(40,170,225)', /*'rgb(119,179,225)',
      'rgb(181,212,239)', 'rgb(0,104,56)',*/ 'rgb(0,148,69)',
      'rgb(57,181,74)', /*'rgb(141,199,63)',*/ 'rgb(215,244,34)',
      'rgb(249,237,50)', 'rgb(248,241,148)', /*'rgb(242,245,205)',*/
      'rgb(123,82,49)', 'rgb(104,73,158)', 'rgb(102,45,145)',
      'rgb(148,149,151)'
    ],
  };

  colorScheme2: Color = {
    name: 'monthlyProdColor',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['green'],
  };

  labelFormatting(label: string): string {
    switch (label) {
      case 'Jan':
        return 'Január'
      case 'Feb':
        return 'Február'
      case 'Márc':
        return 'Március'
      case 'Ápr':
        return 'Április'
      case 'Máj':
        return 'Május'
      case 'Jún':
        return 'Június'
      case 'Júl':
        return 'Július'
      case 'Aug':
        return 'Augusztus'
      case 'Szept':
        return 'Szeptember'
      case 'Okt':
        return 'Október'
      case 'Nov':
        return 'November'
      case 'Dec':
        return 'December'
      default:
        return label;
    }
  }

  valueFormat(value: any) {
    return value + " kWh"
  }

  override onResize() {
    super.onResize();

    if (this.legendPosition === LegendPosition.Below ) {
      this.single = this.solarDataService.getMonthlyShortProduction();
    } else {
      this.single = this.solarDataService.getMonthlyProduction();

    }
  }

  getToolTipMonth(model: any): string {
    return this.labelFormatting(model.label);
  }
}
