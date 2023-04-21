import { OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ViewBoxCalculatorService } from '../../../services/viewbox.calculator.service';
import { Component, ViewEncapsulation } from '@angular/core';

export interface Tooltip {
    color: string;
    d0: number;
    d1: number;
    max: number;
    min: number;
    name: any;
    series: any;
    value: any;
}

@Component({
    selector: 'app-common-chart-base',
    template: '',
    encapsulation: ViewEncapsulation.None,
})
export class CommonChartBaseComponent implements OnInit {
    multi: any;

    // options
    legend = true;
    showLabels = true;
    animations = false;
    legendPosition = LegendPosition.Right;
    xAxis = true;
    yAxis = true;
    showXAxisLabel = false;
    showYAxisLabel = true;
    timeline = true;
    showRefLines = true;
    showRefLabels = false;
    referenceLines: any;

    view: [number, number];

    constructor(private viewBoxCalculatorService: ViewBoxCalculatorService) {
        this.view = viewBoxCalculatorService.getViewBox();
    }

    ngOnInit(): void {
        this.onResize()
    }

    onResize() {
        this.viewBoxCalculatorService.calculatViewBox();

        if (this.viewBoxCalculatorService.isWideWindow()) {
            this.legendPosition = LegendPosition.Right;
        } else {
            this.legendPosition = LegendPosition.Below;
        }
        this.showYAxisLabel = !this.viewBoxCalculatorService.isMobile();

        this.view = this.viewBoxCalculatorService.getViewBox();
    }

    getLocaleDate(value: Date): string {
        return value.toLocaleDateString()
    }

    getToolTipDate(model: Tooltip[]): string {
      if(model.length > 0) {
        const dt = model[0].name
        return dt.toLocaleDateString()
      }
      return ""
    }

    getToolTipText(tooltipItem: Tooltip): string {
        let result = '';
        if (tooltipItem.series !== undefined) {
          result += tooltipItem.series;
        } else {
          result += '???';
        }
        result += ': ';
        if (tooltipItem.value !== undefined) {
          result += tooltipItem.value.toLocaleString("hu-HU") + " kWh";
        }
        if (tooltipItem.min !== undefined || tooltipItem.max !== undefined) {
          result += ' (';
          if (tooltipItem.min !== undefined) {
            if (tooltipItem.max === undefined) {
              result += '≥';
            }
            result += tooltipItem.min.toLocaleString("hu-HU") + " kWh";
            if (tooltipItem.max !== undefined) {
              result += ' - ';
            }
          } else if (tooltipItem.max !== undefined) {
            result += '≤';
          }
          if (tooltipItem.max !== undefined) {
            result += tooltipItem.max.toLocaleString("hu-HU");
          }
          result += ')';
        }
        return result;
      }
}
