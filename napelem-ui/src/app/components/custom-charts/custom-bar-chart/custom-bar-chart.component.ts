// @ts-nocheck

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
  TrackByFunction
} from '@angular/core';
import { scaleBand, scaleLinear, scaleTime, scalePoint } from 'd3-scale';

import { calculateViewDimensions } from '@swimlane/ngx-charts';
import { ColorHelper } from '@swimlane/ngx-charts';
import { Series } from '@swimlane/ngx-charts';
import { BaseChartComponent } from '@swimlane/ngx-charts';
import { BarChartType } from '@swimlane/ngx-charts';
import { LegendOptions, LegendPosition } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';
import { ViewDimensions } from '@swimlane/ngx-charts';
import { curveLinear } from 'd3-shape';
import { getUniqueXDomainValues, getScaleType } from '@swimlane/ngx-charts';
import { AreaChartSeries } from '../models/chart-data.model';

@Component({
  selector: 'app-charts-bar-chart',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelActivate)="onActivate($event, undefined, true)"
      (legendLabelDeactivate)="onDeactivate($event, undefined, true)"
      (legendLabelClick)="onClick($event)"
    >
      <svg:g [attr.transform]="transform" class="bar-chart chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="xScale"
          [dims]="dims"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          [xAxisOffset]="dataLabelMaxHeight.negative"
          (dimensionsChanged)="updateXAxisHeight($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="yScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:g
          *ngFor="let group of getResults(); let index = index; trackBy: trackBy"
          [attr.transform]="groupTransform(group)"
        >
          <svg:g
            ngx-charts-series-vertical
            [type]="barChartType.Stacked"
            [xScale]="xScale"
            [yScale]="yScale"
            [activeEntries]="activeEntries"
            [colors]="colors"
            [series]="group.series"
            [dims]="dims"
            [gradient]="gradient"
            [tooltipDisabled]="tooltipDisabled"
            [tooltipTemplate]="tooltipTemplate"
            [showDataLabel]="showDataLabel"
            [dataLabelFormatting]="dataLabelFormatting"
            [seriesName]="group.name"
            [animations]="animations"
            [noBarWhenZero]="noBarWhenZero"
            (select)="onClick($event, group)"
            (activate)="onActivate($event, group)"
            (deactivate)="onDeactivate($event, group)"
            (dataLabelHeightChanged)="onDataLabelMaxHeightChanged($event, index)"
          />
        </svg:g>
      </svg:g>
      <svg:g
        ngx-charts-timeline
        *ngIf="timeline && scaleType != 'ordinal'"
        [attr.transform]="timelineTransform"
        [results]="resultsTimeline"
        [view]="[timelineWidth, height]"
        [height]="timelineHeight"
        [scheme]="scheme"
        [customColors]="customColors"
        [scaleType]="scaleType"
        [legend]="legend"
        (onDomainChange)="updateDomain($event)"
      >
        <svg:g *ngFor="let series of resultsTimeline; trackBy: trackBy">
          <svg:g
            ngx-charts-area-series
            [xScale]="timelineXScale"
            [yScale]="timelineYScale"
            [colors]="colors"
            [data]="getTimelineSeries(series)"
            [scaleType]="scaleType"
            [gradient]="gradient"
            [stacked]="true"
            [curve]="curve"
            [animations]="animations"
          />
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ['../base-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomBarChartComponent extends BaseChartComponent {
  @Input() legend: boolean = false;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: LegendPosition = LegendPosition.Right;
  @Input() xAxis;
  @Input() yAxis;
  @Input() showXAxisLabel: boolean;
  @Input() showYAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() tooltipDisabled: boolean = false;
  @Input() gradient: boolean;
  @Input() showGridLines: boolean = true;
  @Input() activeEntries: any[] = [];
  @Input() schemeType: ScaleType;
  @Input() trimXAxisTicks: boolean = true;
  @Input() trimYAxisTicks: boolean = true;
  @Input() rotateXAxisTicks: boolean = true;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() barPadding: number = 8;
  @Input() roundDomains: boolean = false;
  @Input() yScaleMax: number;
  @Input() showDataLabel: boolean = false;
  @Input() dataLabelFormatting: any;
  @Input() noBarWhenZero: boolean = true;
  @Input() curve: any = curveLinear;
  @Input() timeline: boolean;

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  groupDomain: string[];
  innerDomain: string[];
  valueDomain: [number, number];
  xScale: any;
  yScale: any;
  transform: string;
  tickFormatting: (label: string) => string;
  colors: ColorHelper;
  margin: number[] = [10, 20, 10, 20];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  legendOptions: LegendOptions;
  dataLabelMaxHeight: any = { negative: 0, positive: 0 };

  barChartType = BarChartType;

  resultsTimeline: any;
  hasRange: boolean; // whether the line has a min-max range around it
  timelineWidth: any;
  timelineHeight: number = 50;
  timelineXScale: any;
  timelineYScale: any;
  timelineXDomain: any;
  timelineYDomain: [number, number];
  timelineTransform: any;
  timelinePadding: number = 10;
  scaleType: ScaleType;
  timelineFilterFrom:any;
  timelineFilterTo:any;

  update(): void {
    super.update();

    if (!this.showDataLabel) {
      this.dataLabelMaxHeight = { negative: 0, positive: 0 };
    }
    this.margin = [10 + this.dataLabelMaxHeight.positive, 20, 10 + this.dataLabelMaxHeight.negative, 20];

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: this.legend,
      legendType: this.schemeType,
      legendPosition: this.legendPosition
    });

    if (this.showDataLabel) {
      this.dims.height -= this.dataLabelMaxHeight.negative;
    }

    if (this.timeline) {
      this.dims.height -= this.timelineHeight + this.margin[2] + this.timelinePadding;
    }

    this.formatDates();

    this.groupDomain = this.getGroupDomain();
    this.innerDomain = this.getInnerDomain();
    this.valueDomain = this.getValueDomain();

    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    this.convertResults();
    this.updateTimeline();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0] + this.dataLabelMaxHeight.negative})`;
  }

  convertResults(): void {
    const resultsTimeline = []
    const rslt = {}

    this.results.forEach( (group) => {
      group.series.forEach( (s) => {
        if (!(s.name in rslt)) {
          const newlist = []
          rslt[s.name] = newlist
          resultsTimeline.push({
            name: s.name,
            series: newlist,
          });
        }
        const lst = rslt[s.name];
        lst.push({
          name: new Date(group.name),
          value: s.value
        });
      })
    })
    this.resultsTimeline = resultsTimeline;
  }

  updateTimeline(): void {
    if (this.timeline) {
      this.timelineWidth = this.dims.width;
      this.timelineXDomain = this.getXDomain();
      this.timelineYDomain = this.getYDomain();

      for (let i = 0; i < this.xSet.length; i++) {
        const val = this.xSet[i];
        let d0 = 0;
        for (const group of this.resultsTimeline) {
          let d = group.series.find(item => {
            let a = item.name;
            let b = val;
            if (this.scaleType === ScaleType.Time) {
              a = a.valueOf();
              b = b.valueOf();
            }
            return a === b;
          });

          if (d) {
            d.d0 = d0;
            d.d1 = d0 + d.value;
            d0 += d.value;
          } else {
            d = {
              name: val,
              value: 0,
              d0,
              d1: d0
            };
            group.series.push(d);
          }
        }
      }

      this.timelineXScale = this.getTimelineXScale(this.timelineXDomain, this.timelineWidth);
      this.timelineYScale = this.getTimelineYScale(this.timelineYDomain, this.timelineHeight);
      this.timelineTransform = `translate(${this.dims.xOffset}, ${-this.margin[2]})`;
    }
  }

  getXDomain(): any[] {
    let values = getUniqueXDomainValues(this.resultsTimeline);

    this.scaleType = getScaleType(values);
    let domain = [];

    if (this.scaleType === ScaleType.Linear) {
      values = values.map(v => Number(v));
    }

    let min;
    let max;
    if (this.scaleType === ScaleType.Time || this.scaleType === ScaleType.Linear) {
      min = this.xScaleMin ? this.xScaleMin : Math.min(...values);

      max = this.xScaleMax ? this.xScaleMax : Math.max(...values);
    }

    if (this.scaleType === ScaleType.Time) {
      domain = [new Date(min), new Date(max)];
      this.xSet = [...values].sort((a, b) => {
        const aDate = a.getTime();
        const bDate = b.getTime();
        if (aDate > bDate) return 1;
        if (bDate > aDate) return -1;
        return 0;
      });
    } else if (this.scaleType === ScaleType.Linear) {
      domain = [min, max];
      // Use compare function to sort numbers numerically
      this.xSet = [...values].sort((a, b) => a - b);
    } else {
      domain = values;
      this.xSet = values;
    }

    return domain;
  }

  getYDomain(): [number, number] {
    const domain = [];

    for (let i = 0; i < this.xSet.length; i++) {
      const val = this.xSet[i];
      let sum = 0;
      for (const group of this.resultsTimeline) {
        const d = group.series.find(item => {
          let a = item.name;
          let b = val;
          if (this.scaleType === ScaleType.Time) {
            a = a.valueOf();
            b = b.valueOf();
          }
          return a === b;
        });

        if (d) {
          sum += d.value;
        }
      }

      domain.push(sum);
    }

    const min = this.yScaleMin ? this.yScaleMin : Math.min(0, ...domain);

    const max = this.yScaleMax ? this.yScaleMax : Math.max(...domain);
    return [min, max];
  }

  getTimelineXScale(domain, width: number): any {
    let scale;

    if (this.scaleType === ScaleType.Time) {
      scale = scaleTime().range([0, width]).domain(domain);
    } else if (this.scaleType === ScaleType.Linear) {
      scale = scaleLinear().range([0, width]).domain(domain);

      if (this.roundDomains) {
        scale = scale.nice();
      }
    } else if (this.scaleType === ScaleType.Ordinal) {
      scale = scalePoint().range([0, width]).padding(0.1).domain(domain);
    }

    return scale;
  }

  getTimelineYScale(domain, height: number): any {
    const scale = scaleLinear().range([height, 0]).domain(domain);
    return this.roundDomains ? scale.nice() : scale;
  }

  getResults() {
    const arr = []
    this.results.forEach(r => {
      if (this.isInside(r)) {
        arr.push(r);
      }
    })
    return arr;
  }

  isInside(group:any): boolean {
    let dt = new Date(group.name);
    if (this.timelineFilterFrom) {
      if (this.timelineFilterFrom > dt) {
        return false;
      }
    }
    if (this.timelineFilterTo) {
      if (this.timelineFilterTo < dt) {
        return false;
      }
    }
    return true;
  }

  getGroupDomain(): string[] {
    const domain = [];
    for (const group of this.results) {
      if (!this.isInside(group)) {
        continue;
      }
      if (!domain.includes(group.label)) {
        domain.push(group.label);
      }
    }
    return domain;
  }

  getInnerDomain(): string[] {
    const domain = [];
    for (const group of this.results) {
      if (!this.isInside(group)) {
        continue;
      }
      for (const d of group.series) {
        if (!domain.includes(d.label)) {
          domain.push(d.label);
        }
      }
    }
    return domain;
  }

  getValueDomain(): [number, number] {
    const domain = [];
    let smallest = 0;
    let biggest = 0;
    for (const group of this.results) {
      let smallestSum = 0;
      let biggestSum = 0;
      for (const d of group.series) {
        if (d.value < 0) {
          smallestSum += d.value;
        } else {
          biggestSum += d.value;
        }
        smallest = d.value < smallest ? d.value : smallest;
        biggest = d.value > biggest ? d.value : biggest;
      }
      domain.push(smallestSum);
      domain.push(biggestSum);
    }
    domain.push(smallest);
    domain.push(biggest);

    const min = Math.min(0, ...domain);
    const max = this.yScaleMax ? Math.max(this.yScaleMax, ...domain) : Math.max(...domain);
    return [min, max];
  }

  getXScale(): any {
    const spacing = this.groupDomain.length / (this.dims.width / this.barPadding + 1);
    return scaleBand().rangeRound([0, this.dims.width]).paddingInner(spacing).domain(this.groupDomain);
  }

  getYScale(): any {
    const scale = scaleLinear().range([this.dims.height, 0]).domain(this.valueDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  onDataLabelMaxHeightChanged(event, groupIndex: number) {
    if (event.size.negative) {
      this.dataLabelMaxHeight.negative = Math.max(this.dataLabelMaxHeight.negative, event.size.height);
    } else {
      this.dataLabelMaxHeight.positive = Math.max(this.dataLabelMaxHeight.positive, event.size.height);
    }
    if (groupIndex === this.results.length - 1) {
      setTimeout(() => this.update());
    }
  }

  groupTransform(group: Series): string {
    return `translate(${this.xScale(group.name) || 0}, 0)`;
  }

  onClick(data, group?: Series) {
    if (group) {
      data.series = group.name;
    }

    this.select.emit(data);
  }

  trackBy: TrackByFunction<Series> = (index: number, item: Series) => {
    return item.name;
  };

  setColors(): void {
    let domain;
    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.innerDomain;
    } else {
      domain = this.valueDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  getLegendOptions(): LegendOptions {
    const opts = {
      scaleType: this.schemeType as any,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition
    };
    if (opts.scaleType === ScaleType.Ordinal) {
      opts.domain = this.innerDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.valueDomain;
      opts.colors = this.colors.scale;
    }

    return opts;
  }

  updateYAxisWidth({ width }: { width: number }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }: { height: number }): void {
    this.xAxisHeight = height;
    this.update();
  }

  onActivate(event, group, fromLegend: boolean = false): void {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }

    const items = this.results
      .map(g => g.series)
      .flat()
      .filter(i => {
        if (fromLegend) {
          return i.label === item.name;
        } else {
          return i.name === item.name && i.series === item.series;
        }
      });

    this.activeEntries = [...items];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(event, group: Series | undefined, fromLegend: boolean = false) {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }

    this.activeEntries = this.activeEntries.filter(i => {
      if (fromLegend) {
        return i.label !== item.name;
      } else {
        return !(i.name === item.name && i.series === item.series);
      }
    });

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }

  updateDomain(domain): void {
    this.timelineFilterFrom = domain[0]
    this.timelineFilterTo = domain[1]
    setTimeout(() => this.update());
  }

  getTimelineSeries(series: any): AreaChartSeries {
    return series;
  }
}
