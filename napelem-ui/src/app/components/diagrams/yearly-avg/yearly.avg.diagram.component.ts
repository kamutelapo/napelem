import { Component } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SolarDataService } from '../../../services/solar.data.service';

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
export class YearlyAvgDiagramComponent {
  multi: any;

  // options
  legend= true;
  showLabels = true;
  animations = false;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = false;
  xAxisLabel = 'Nap';
  yAxisLabel = 'Átlagtermelés';
  timeline = true;

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
}
