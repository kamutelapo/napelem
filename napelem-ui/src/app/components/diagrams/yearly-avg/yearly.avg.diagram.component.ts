import { Component, OnInit } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { SolarDataService } from '../../../services/solar.data.service';
import { hierarchy } from 'd3-hierarchy';

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
  selector: 'app-yearly-avg-diagram',
  templateUrl: './yearly.avg.diagram.component.html',
  styleUrls: ['./yearly.avg.diagram.component.css']
})
export class YearlyAvgDiagramComponent implements OnInit {
  multi: any;

  // options
  legend = true;
  legendPosition = LegendPosition.Right;
  showLabels = true;
  animations = false;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = false;
  xAxisLabel = 'Nap';
  yAxisLabel = 'Átlagtermelés';
  timeline = true;

  view: [number, number] = [400, 250];

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['mediumorchid', 'orange'],
  };


  constructor(private solarDataService: SolarDataService ) {
    this.multi = solarDataService.getYearlyAverageProductionSeries();
  }

  onSelect(event: any) {
    console.log(event);
  }

  valueFormat(value: any) {
    return value + " kWh"
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

  getToolTipSum(model: Tooltip[]): string {
    let sum = 0
    model.forEach( (item) => {
      sum += item.value
    });
    return "Összes termelés: " + sum.toLocaleString("hu-HU") + " kWh"
  }

  getToolTipText(tooltipItem: Tooltip): string {
    let result: string = '';
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

  ngOnInit(): void {
    this.onResize()
  }

  onResize() {
    const HEADER_SIZE = 80;
    const SIDENAV_SIZE = 210;
    const ratio = window.innerWidth / window.innerHeight;

    let deltaY = 0;

    if (ratio <= 1.66) {
      this.legendPosition = LegendPosition.Below;
      deltaY = 50;
    } else {
      this.legendPosition = LegendPosition.Right;
    }
    let width = window.innerWidth - SIDENAV_SIZE;
    if (width < 100) {
      width = 100;
    }
    let height = window.innerHeight - HEADER_SIZE - deltaY;
    if (height < 100) {
      height = 100;
    }

    this.view[0] = width;
    this.view[1] = height;
  }
}
