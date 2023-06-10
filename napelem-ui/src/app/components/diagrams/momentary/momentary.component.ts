import { Component, ViewEncapsulation } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SolarDataService } from '../../../services/solar.data.service';
import { CommonChartBaseComponent, Tooltip } from '../common/common.chart.base.component';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';

@Component({
  selector: 'app-momentary',
  templateUrl: './momentary.component.html',
  styleUrls: ['./momentary.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MomentaryComponent extends CommonChartBaseComponent {
  title = "Pillanatnyi értékek";

  xAxisLabel = 'Idő';
  yAxisLabel = 'Pillanatnyi fogyasztás és termelés';

  rangeSelector = 31
  daycnt = 1

  rawData: any;

  colorScheme: Color = {
    name: 'momentScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['green', 'royalblue', 'cornflowerblue'],
  };


  constructor(private solarDataService: SolarDataService, viewBoxCalculatorService: ViewBoxCalculatorService) {
    super(viewBoxCalculatorService);
    this.spaceY = viewBoxCalculatorService.isMobile() ? 100 : 50;
    this.view = this.getViewBox()

    this.rawData = solarDataService.getRaw();
    this.daycnt = solarDataService.getRawIndex().length - 7 - 1;
    if (this.daycnt < 0) {
      this.daycnt = 0;
    }
    this.rangeSelector = this.daycnt;
    this.sliceRaw();
    this.referenceLines = [
      { value: 0, name: '' }
    ];
  }

  valueFormat(value: any) {
    return value + " W"
  }

  override getToolTipText(tooltipItem: Tooltip): string {
    let result = '';
    if (tooltipItem.series !== undefined) {
      result += tooltipItem.series;
      result += ': ';
      if (tooltipItem.value !== undefined) {
        result += Math.abs(tooltipItem.value).toLocaleString("hu-HU") + " W";
      }
      return result;
    } else {
      return super.getToolTipText(tooltipItem);
    }
  }

  getNgClassType(): string {
    return this.viewBoxCalculatorService.isMobile() ? 'mobile' : 'desktop';
  }

  moveBack() {
    if (this.rangeSelector > 0) {
      this.rangeSelector = this.rangeSelector - 1;
      this.sliceRaw();
    }
  }

  moveForward() {
    if (this.rangeSelector < this.daycnt) {
      this.rangeSelector = this.rangeSelector + 1;
      this.sliceRaw();
    }
  }

  sliceRaw() {
    const firstndx = this.solarDataService.getRawIndex()[this.rangeSelector];
    const lastndx = this.solarDataService.getRawIndex()[this.rangeSelector + 7] - 1;
    const output: any[] = []

    this.rawData.forEach( (d: any) => {
      output.push({
        name: d["name"],
        series: d["series"].slice(firstndx, lastndx)
      });
    });

    this.multi = output;
  }

  getRangeText(): string {
    const len = this.multi[0].series.length;
    return this.multi[0].series[0]["name"].toLocaleDateString() + " - " + this.multi[0].series[len - 1]["name"].toLocaleDateString()
  }
}
