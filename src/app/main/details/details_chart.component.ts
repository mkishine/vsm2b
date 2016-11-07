import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Highcharts } from 'angular2-highcharts';
import * as _ from 'lodash';
import { GenStatRecord } from '../../model/gen-stat-record';

Highcharts.setOptions({
  global: {
    useUTC: false
  }
});

class GSRPointRep {
  constructor(public gsr:GenStatRecord, public y:number) {
  }

  get x():number {
    return this.gsr.asofDate;
  }
}

@Component({
  selector: 'details-chart',
  templateUrl: './details_chart.component.html',
  styleUrls: ['./details_chart.component.css']
})
export class DetailsChartComponent implements OnChanges {
  @Input() records:GenStatRecord[];
  @Input() isSelected:(GenStatRecord)=>boolean;
  @Output() onZoomChanged = new EventEmitter<[number,number]>();

  private options:any;
  private chart:HighchartsChartObject;

  // all points (invisible, base series for navigator)
  private data:GSRPointRep[] = [];
  private minAsofDate:number;
  private maxAsofDate:number;

  // fast, medium, and slow sets - with no selection
  private dataFast:GSRPointRep[] = [];
  private dataMed:GSRPointRep[] = [];
  private dataSlow:GSRPointRep[] = [];
  // fast, medium, and slow sets - with selection
  private data1Fast:GSRPointRep[] = [];
  private data2Fast:GSRPointRep[] = [];
  private data1Med:GSRPointRep[] = [];
  private data2Med:GSRPointRep[] = [];
  private data1Slow:GSRPointRep[] = [];
  private data2Slow:GSRPointRep[] = [];

  constructor() {
    this.options = this.getChartOptions();
  }

  private saveInstance(chartInstance) {
    this.chart = chartInstance;
  }

  private onAfterSetExtremesX(e) {
    const min:number = e.context.min <= this.minAsofDate ? null : e.context.min;
    const max:number = e.context.max >= this.maxAsofDate ? null : e.context.max;
    this.onZoomChanged.emit([min, max]);
  }
  private setSeries() {
    this.updateData();
    this.chart.addSeries({
      name: 'allData',
      data: this.data,
      visible: false
    }, false);
    this.chart.addSeries({
      name: 'sFast',
      data: this.dataFast,
      marker: {
        fillColor: 'lightblue',
      }
    }, false);
    this.chart.addSeries({
      name: 'sMed',
      data: this.dataMed,
      marker: {
        fillColor: 'blue',
      }
    }, false);
    this.chart.addSeries({
      name: 'sSlow',
      data: this.dataSlow,
      marker: {
        fillColor: 'darkblue',
      }
    }, false);
    this.chart.redraw();
  }
  ngOnChanges(changes:SimpleChanges) {
    if( 'records' in changes ) {
      if ( _.get(changes, 'records.currentValue.length') > 0 ) {
        this.setSeries();
      }
    }
    if ( 'isSelected' in changes ) {
      if ( this.data.length !== 0 ) {
        this.focus();
      }
    }
  }
  private getChartOptions() {
    return {
      navigator: {
        baseSeries: 'allData'
      },
      rangeSelector: {
        buttons: [{
          type: 'minute',
          count: 1,
          text: '1m'
        }, {
          type: 'minute',
          count: 5,
          text: '5m'
        }, {
          type: 'minute',
          count: 15,
          text: '15m'
        }, {
          type: 'all',
          text: 'All'
        }],
        inputEnabled: false,
        selected: 3 // all
      },
      plotOptions: {
        series: {
          lineWidth: 0,
          marker: {
            enabled: true,
            radius: 3,
            symbol: 'circle'
          },
          turboThreshold: 0,
          dataGrouping: {
            approximation: 'high',
            enabled: true
          },
          tooltip: {
            valueDecimals: 2,
            pointFormatter: function () {
              let s:string;
              if (this.dataGroup) {
                //const begin = this.dataGroup.start;
                //const end = begin + this.dataGroup.length;
                //s = '';
                //// this.data is not right (here this points to highcharts point object)
                //// TODO: find out how to access original data
                //this.data.slice(begin, end).forEach((p)=> {
                //  s += `${p.gsr.user} ${p.y}<br>`;
                //});
              } else if (this.gsr) {
                const gsr = <GenStatRecord>this.gsr;
                s = `${gsr.user} ${this.y}`;
              } else {
                s = '????';
              }
              return s;
            }
          },
          states: {
            hover: {
              lineWidthPlus: 0
            }
          }
        }
      },
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'VARServer Usage'
      },
      series: []
    };
  }

  private fast(p:GSRPointRep):boolean {
    return p.gsr.reqTime < 1.0;
  }

  private slow(p:GSRPointRep):boolean {
    return p.gsr.reqTime > 60.0;
  }

  private medium(p:GSRPointRep):boolean {
    // I am getting exceptions on calling fast
    // TODO: figure out how to call fast and slow
    // return !this.fast(p) && !this.slow(p);
    return p.gsr.reqTime >= 1.0 && p.gsr.reqTime <= 60.0;
  }

  private updateData():void {
    // construct array of gsrs and end times, sort
    let x:(GenStatRecord|number)[] = [];
    this.records.forEach((gsr)=> {
      x.push(gsr);
      x.push(gsr.asofDate + gsr.reqTime * 1000);
    });
    x.sort((a, b)=> {
      const aa:number = a instanceof GenStatRecord ? a.asofDate : a;
      const bb:number = b instanceof GenStatRecord ? b.asofDate : b;
      return aa - bb;
    });
    // build data
    let yMax = 1;
    x.forEach((p)=> {
      if (p instanceof GenStatRecord) {
        this.data.push(new GSRPointRep(p, yMax));
        ++yMax;
      } else {
        --yMax;
      }
    });
    this.minAsofDate = this.data[0].gsr.asofDate;
    this.maxAsofDate = this.data[this.data.length - 1].gsr.asofDate;
    this.dataFast = this.data.filter(this.fast);
    this.dataMed = this.data.filter(this.medium);
    this.dataSlow = this.data.filter(this.slow);
  }

  private clear() {
    for (let ii = this.chart.series.length - 1; ii >= 0; --ii) {
      const s = this.chart.series[ii];
      if (s.name === 'Navigator' || s.name === 'allData') {
        continue;
      }
      s.remove(false);
    }
  }

  private focus() {
    this.clear();
    this.data1Fast = this.data.filter(p => this.isSelected(p.gsr)&&this.fast(p));
    this.data2Fast = this.data.filter(p => (!this.isSelected(p.gsr))&&this.fast(p));
    this.data1Med = this.data.filter(p => this.isSelected(p.gsr)&&this.medium(p));
    this.data2Med = this.data.filter(p => (!this.isSelected(p.gsr))&&this.medium(p));
    this.data1Slow = this.data.filter(p => this.isSelected(p.gsr)&&this.slow(p));
    this.data2Slow = this.data.filter(p => (!this.isSelected(p.gsr))&&this.slow(p));
    this.chart.addSeries({
      name: 's1fast',
      data: this.data1Fast,
      marker: {
        fillColor: 'lightgreen',
      }
    }, false);
    this.chart.addSeries({
      name: 's2fast',
      data: this.data2Fast,
      marker: {
        fillColor: 'lightblue',
      }
    }, false);
    this.chart.addSeries({
      name: 's1med',
      data: this.data1Med,
      marker: {
        fillColor: 'green',
      }
    }, false);
    this.chart.addSeries({
      name: 's2med',
      data: this.data2Med,
      marker: {
        fillColor: 'blue',
      }
    }, false);
    this.chart.addSeries({
      name: 's1slow',
      data: this.data1Slow,
      marker: {
        fillColor: 'darkgreen',
      }
    }, false);
    this.chart.addSeries({
      name: 's2slow',
      data: this.data2Slow,
      marker: {
        fillColor: 'darkblue',
      }
    }, false);
    this.chart.redraw();
  }
}
