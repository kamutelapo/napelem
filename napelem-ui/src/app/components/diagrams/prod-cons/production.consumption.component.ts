import { Component, ViewEncapsulation } from '@angular/core';
import { SolarDataService } from '../../../services/solar.data.service';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonChartBaseComponent } from '../common/common.chart.base.component';

@Component({
  selector: 'app-production-consumption',
  templateUrl: './production.consumption.component.html',
  styleUrls: ['./production.consumption.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductionConsumptionComponent extends CommonChartBaseComponent {
  title = "Fogyasztás-termelés";

  public xAxisLabel = "Nap";
  public yAxisLabel = "Fogyasztás-termelés";

  public avgProd: number;
  public avgCons: number;

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
    this.avgProd = solarDataService.getAverageProduction();
    this.avgCons = solarDataService.getAverageConsumption();
    this.multi = solarDataService.getProductionConsumption();
    this.referenceLines = [
      { value: solarDataService.getAverageConsumption(), name: 'átlag fogyasztás' },
      { value: solarDataService.getAverageProduction(), name: 'átlag termelés' },
    ];
  }

  getChartId() {
    if (this.solarDataService.getAverageConsumption() > this.solarDataService.getAverageProduction()) {
      return 'prodconchart-cons'
    }
    return 'prodconchart-prod'
  }
}
