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

  get color():string {
    return 'red';
  }

  get marker():any {
    return {
      fillColor: 'blue'
    };
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

@Component({
  selector: 'app-root',
  template: `
        <chart type="StockChart" [options]="options">
          <xAxis (afterSetExtremes)="onAfterSetExtremesX($event)"></xAxis>
        </chart>
    `
})
export class ChartsExample {
  private options:any;

  constructor() {
    this.options = {
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
            radius: 2,
            fillColor: 'green',
          },
          turboThreshold: 0,
          dataGrouping: {
            approximation: 'high',
            enabled: true
          }
        }
      },
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'VARServer Usage'
      },
      series: [{
        name: '',
        data: data,
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
      }]
    };
  }

  onAfterSetExtremesX(e) {
    const min:number = e.context.min <= minAsofDate ? null : e.context.min;
    const max:number = e.context.max >= maxAsofDate ? null : e.context.max;
    // console.log(`${min} ${max}`);
  }
}
