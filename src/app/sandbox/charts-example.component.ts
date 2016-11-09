import { Component } from '@angular/core';
import { Highcharts } from 'angular2-highcharts';
@Component({
  selector: 'app-root',
  template: `
        <chart [options]="options" (load)="saveInstance($event.context)">
        </chart>
    `
})
export class ChartsExample {
  private options:any;
  private chart:HighchartsChartObject;

  constructor() {
    this.options = {
      chart: {
        type: 'bar'
      },
      title: {
        text: null
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
        series: {
          animation: false,
          dataLabels: {
            enabled: true,
            align: 'left',
            inside: true,
            format: '{point.name} - {y}',
            style: ''
          }
        }
      },
      series: [{
        data: [{
          name: 'Test 1',
          y: 20,
        }, {
          name: 'Test 2',
          y: 20
        }, {
          name: 'Test 3',
          y: 40
        }]
      }]
    };
  }

  private saveInstance(chartInstance) {
    this.chart = chartInstance;
  }
}
