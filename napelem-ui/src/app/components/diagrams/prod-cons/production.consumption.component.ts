import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { SolarDataService } from '../../../services/solar.data.service';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonChartBaseComponent, Tooltip } from '../common/common.chart.base.component';
import { CustomLineChartComponent } from '../../custom-charts/custom-line-chart/custom-line-chart.component';

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

  @ViewChild('chart') chart: CustomLineChartComponent | null = null;

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

  getToolTipMeter(model: Tooltip[], node: string): string {
    let meter = "?"
    model.forEach( (item) => {
      if ("extra" in item) {
        if (node in item.extra) {
          meter = item.extra[node].toLocaleString("hu-HU")
        }
      }
    });
    return meter
  }

  onDomainChanged(event: any) {
    if (this.chart) {
      if (event && this.chart.hasTimelineSelection()) {
        const ndxlo = this.solarDataService.findDate(event[0] as Date, this.multi[0].series, false);
        const ndxhi = this.solarDataService.findDate(event[1] as Date, this.multi[0].series, true);

        if ((ndxlo >= 0) && (ndxhi >= 0)) {
          const impmeterlo = this.multi[1].series[ndxlo].extra["Import"];
          const impmeterhi = this.multi[1].series[ndxhi].extra["Import"];
          const expmeterlo = this.multi[0].series[ndxlo].extra["Export"];
          const expmeterhi = this.multi[0].series[ndxhi].extra["Export"];

          const impTotalStr = (impmeterhi - impmeterlo).toFixed(1);
          const expTotalStr = (expmeterhi - expmeterlo).toFixed(1);
          const label = "T: " + expTotalStr + " kWh, F: " + impTotalStr + " kWh";
          this.chart.setLegendTitle(label);
          return;
        }
      }
      this.chart.setLegendTitle('Görbe');
    }
  }

}
