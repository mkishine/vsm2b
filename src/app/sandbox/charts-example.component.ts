import { Component } from '@angular/core';
import { GenStatRecordListBuilder } from './../utilities/gen-stat-record-list-builder';
import { GenStatRecord } from './../model/gen-stat-record';
import { Highcharts } from 'angular2-highcharts';

Highcharts.setOptions({
  global: {
    useUTC: false
  }
});


const rawGsrs = require('../../gen_stat_dump.BLK.20160831T0900-20160831T1000.json');
const builder = new GenStatRecordListBuilder();
const gsrs = builder.buildGenStatRecordList(rawGsrs);

let x:(GenStatRecord|number)[] = [];
gsrs.forEach((gsr)=> {
  x.push(gsr);
  x.push(gsr.asofDate + gsr.reqTime * 1000);
});
x.sort((a, b)=> {
  const aa:number = a instanceof GenStatRecord ? a.asofDate : a;
  const bb:number = b instanceof GenStatRecord ? b.asofDate : b;
  return aa - bb;
});


class GSRPointRep {
  constructor(public gsr:GenStatRecord, public y:number) {
  }

  get x():number {
    return this.gsr.asofDate;
  }
}

let yMax = 1;
let data:GSRPointRep[] = [];
x.forEach((p)=> {
  if (p instanceof GenStatRecord) {
    data.push(new GSRPointRep(p, yMax));
    ++yMax;
  } else {
    --yMax;
  }
});
const minAsofDate = data[0].gsr.asofDate;
const maxAsofDate = data[data.length - 1].gsr.asofDate;

function fast(p:GSRPointRep) {
  return p.gsr.reqTime < 1.0;
}
function slow(p:GSRPointRep) {
  return p.gsr.reqTime > 60.0;
}
function medium(p:GSRPointRep) {
  return !fast(p) && !slow(p);
}

const dataFast = data.filter(fast);
const dataMed = data.filter(medium);
const dataSlow = data.filter(slow);

let data1Fast:GSRPointRep[] = [];
let data2Fast:GSRPointRep[] = [];
let data1Med:GSRPointRep[] = [];
let data2Med:GSRPointRep[] = [];
let data1Slow:GSRPointRep[] = [];
let data2Slow:GSRPointRep[] = [];

@Component({
  selector: 'app-root',
  template: `
        <chart type="StockChart" [options]="options"
          (load)="saveInstance($event.context)">
          <xAxis (afterSetExtremes)="onAfterSetExtremesX($event)"></xAxis>
        </chart>
        <button (click)="showVARServer()">Show VARServer</button>
        <button (click)="showMapReports()">Show MAP Reports</button>
        <button (click)="reset()">Reset</button>
    `
})
export class ChartsExample {
  private options:any;
  private chart:HighchartsChartObject;

  constructor() {
    this.options = {
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
                const begin = this.dataGroup.start;
                const end = begin + this.dataGroup.length;
                s = '';
                data.slice(begin, end).forEach((p)=> {
                  s += `${p.gsr.user} ${p.y}<br>`;
                });
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
      series: [
        {
          name: 'allData',
          data: data,
          visible: false
        },
        {
          name: 'sFast',
          data: dataFast,
          marker: {
            fillColor: 'lightblue',
          }
        },
        {
          name: 'sMed',
          data: dataMed,
          marker: {
            fillColor: 'blue',
          }
        }, {
          name: 'sSlow',
          data: dataSlow,
          marker: {
            fillColor: 'darkblue',
          }
        },
      ]
    };
  }

  private saveInstance(chartInstance) {
    this.chart = chartInstance;
  }

  private onAfterSetExtremesX(e) {
    const min:number = e.context.min <= minAsofDate ? null : e.context.min;
    const max:number = e.context.max >= maxAsofDate ? null : e.context.max;
    // console.log(`${min} ${max}`);
  }

  private showVARServer() {
    this.focus((gsr:GenStatRecord)=>gsr.appServer === 'VARServer');
  }

  private showMapReports() {
    this.focus((gsr:GenStatRecord)=>gsr.reportType === 'VAR_MAP');
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

  private focus(selection:(GenStatRecord)=>boolean) {
    this.clear();
    data1Fast = data.filter(p => selection(p.gsr)&&fast(p));
    data2Fast = data.filter(p => (!selection(p.gsr))&&fast(p));
    data1Med = data.filter(p => selection(p.gsr)&&medium(p));
    data2Med = data.filter(p => (!selection(p.gsr))&&medium(p));
    data1Slow = data.filter(p => selection(p.gsr)&&slow(p));
    data2Slow = data.filter(p => (!selection(p.gsr))&&slow(p));
    this.chart.addSeries({
      name: 's1fast',
      data: data1Fast,
      marker: {
        fillColor: 'lightgreen',
      }
    }, false);
    this.chart.addSeries({
      name: 's2fast',
      data: data2Fast,
      marker: {
        fillColor: 'lightblue',
      }
    }, false);
    this.chart.addSeries({
      name: 's1med',
      data: data1Med,
      marker: {
        fillColor: 'green',
      }
    }, false);
    this.chart.addSeries({
      name: 's2med',
      data: data2Med,
      marker: {
        fillColor: 'blue',
      }
    }, false);
    this.chart.addSeries({
      name: 's1slow',
      data: data1Slow,
      marker: {
        fillColor: 'darkgreen',
      }
    }, false);
    this.chart.addSeries({
      name: 's2slow',
      data: data2Slow,
      marker: {
        fillColor: 'darkblue',
      }
    }, false);
    this.chart.redraw();
  }

  private reset() {
    this.clear();
    this.chart.addSeries({
      name: 'sFast',
      data: dataFast,
      marker: {
        fillColor: 'lightblue',
      }
    }, false);
    this.chart.addSeries({
      name: 'sMed',
      data: dataMed,
      marker: {
        fillColor: 'blue',
    }
    }, false);
    this.chart.addSeries({
      name: 'sSlow',
      data: dataSlow,
      marker: {
        fillColor: 'darkblue',
      }
    }, false);
    this.chart.redraw();
  }
}
