import { Component, ViewEncapsulation } from '@angular/core';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';
import { CommonChartBaseComponent } from '../../diagrams/common/common.chart.base.component';
import { SolarDataService } from 'src/app/services/solar.data.service';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-usage-details',
  templateUrl: './usage.details.component.html',
  styleUrls: ['./usage.details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UsageDetailsComponent extends CommonChartBaseComponent {
  single: any;

  isDoughnut = false;
  gradient = false;
  detailsLegendPosition = LegendPosition.Below;

  constructor(private solarDataService: SolarDataService, viewBoxCalculatorService: ViewBoxCalculatorService) {
    super(viewBoxCalculatorService);

    this.single = solarDataService.getUsageDetails();
  }

  getUsageDetailsClass() {
    let isMobile = this.viewBoxCalculatorService.isMobile();
    return isMobile ? "usage-details-mobile" : "usage-details-desktop";
  }

  override getViewBox(): [number, number] {
    const view = super.getViewBox();
    const vw = view[0] * 0.62;
    const vh = view[1] * 0.5;
    return [vw, vh];
  }

  colorScheme: Color = {
    name: 'usageDetailsScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['green', 'royalblue', 'cornflowerblue'],
  };

  override onResize(): void {
    super.onResize();

    this.showLabels = !this.viewBoxCalculatorService.isMobile();
    this.isDoughnut = !this.showLabels;
  }
}
