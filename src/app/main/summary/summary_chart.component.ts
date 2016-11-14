import {Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {ChartObject, PointObject} from 'highcharts';
import * as _ from 'lodash';

@Component({
  selector: 'summary-chart',
  templateUrl: './summary_chart.component.html',
  styleUrls: ['./summary_chart.component.css']
})
export class SummaryChartComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() type: string;
  @Input() data: [string, number][];
  @Input() selectionTitle: string;
  @Input() selectionValue: string;
  @Output() onSummarySelected = new EventEmitter<[string, string]>();

  private options = {
    chart: {
      type: 'bar'
    },
    title: {
      text: null,
      style: {fontSize: '14px'}
    },
    credits: {
      enabled: false
    },
    xAxis: {
      visible: false
    },
    yAxis: {
      visible: false
    },
    legend: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      bar: {
        pointPadding: 0,
        groupPadding: 0,
        borderWidth: 2,
      },
      series: {
        animation: false,
        stacking: 'normal',
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          inside: true,
          crop: false,
          overflow: 'none',
          format: '{point.name}',
          style: ''
        }
      }
    },
    series: []
  };
  private chart: ChartObject;
  private seriesOptions: any = {data: [], dataLabels: {align: 'left'}};
  private seriesOptions2: any = {data: [], dataLabels: {align: 'right'}};

  ngOnInit() {
    if (this.haveData()) {
      this.setSeriesOptions();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.chart) {
      return;
    }
    if (_.get(changes, ['data', 'currentValue', 'length'])) {
      this.setSeriesOptions();
      this.addSeries();
      if (this.selectionTitle === this.title) {
        const points: PointObject[] = (<any>this.chart.series[1]).points;
        const pt = points.find(p=>p.name === this.selectionValue);
        if (pt) {
          this.select(pt);
        }
      }
    }
    if (!changes['selectionValue']) {
      return;
    }
    const newTitle = changes['selectionTitle'] ? changes['selectionTitle'].currentValue : this.title;
    const newValue = newTitle === this.title ? changes['selectionValue'].currentValue : null;
    const points: PointObject[] = (<any>this.chart.series[1]).points;
    const pt = points.find(p=>p.name === newValue);
    this.select(pt);
  }

  private setSeriesOptions(): void {
    const cutoff = 5;
    const total = this.data.reduce((a, b)=>a + b[1], 0);
    this.seriesOptions.data = this.data.slice(0, cutoff).map(e=> {
      return {name: e[0], y: e[1], color: 'lightblue'};
    });
    const suffix = this.type === 'Time' ? ' sec' : '';
    this.seriesOptions2.data = this.data.slice(0, cutoff).map(e=> {
      const name = Math.round(e[1]).toLocaleString() + suffix;
      const y = total - e[1];
      return {name: name, y: y, color: 'whitesmoke'};
    });
    if (this.data.length > cutoff) {
      const otherY = this.data.slice(cutoff).reduce((a, b)=>a + b[1], 0);
      this.seriesOptions.data.push({name: 'Other', y: otherY, color: 'lightgrey'});
      const name2 = Math.round(otherY).toLocaleString() + suffix;
      const otherY2 = total - otherY;
      this.seriesOptions2.data.push({name: name2, y: otherY2, color: 'whitesmoke'});
    }
  }

  private haveData(): boolean {
    return this.data && this.data.length !== 0;
  }


  private addSeries(): void {
    for (let ii = this.chart.series.length - 1; ii >= 0; --ii) {
      const s = this.chart.series[ii];
      s.remove(false);
    }
    this.chart.addSeries(this.seriesOptions2, false);
    this.chart.addSeries(this.seriesOptions, false);
    this.chart.setTitle({text: `${this.title} ${this.type}`}, false);
    this.chart.redraw();
  }

  private saveInstance(chartInstance) {
    this.chart = chartInstance;
    if (this.haveData()) {
      this.addSeries();
    }
  }

  private select(pt: PointObject): void {
    const points: PointObject[] = (<any>this.chart.series[1]).points;
    const otherPoints: PointObject[] = (<any>this.chart.series[0]).points;
    const pt2 = points.find(p => (<any>p).color === 'lightgreen');
    if (pt2 === pt) {
      return;
    }
    if (pt2) {
      pt2.update({color: 'lightblue'}, false);
      otherPoints[pt2.index].update({color: 'whitesmoke'}, false);
    }
    if (pt) {
      pt.update({color: 'lightgreen'}, false);
      otherPoints[pt.index].update({color: '#ddf9dd'}, false);
    }
    this.chart.redraw(false);
  }

  private onPointClick(e) {
    const pt = e.context.series.chart.series[1].points[e.context.index];
    if (pt.name === 'Other' && pt.index === pt.series.points.length - 1) {
      return;
    }
    this.select(pt);
    this.onSummarySelected.emit([this.title, pt.name]);
  }
}

