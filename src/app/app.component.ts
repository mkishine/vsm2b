import { Component, OnInit } from '@angular/core';
import { GenStatDataService } from './gen-stat-data.service';
import { GenStatRecord } from './gen-stat-record';
import * as _ from "lodash";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private originalRecords:GenStatRecord[];
  private records:GenStatRecord[] = [];

  private clientCountSummary:[string, number][];
  private appServerCountSummary:[string, number][];
  private reportTypeCountSummary:[string, number][];
  private reportCountSummary:[string, number][];
  private portCountSummary:[string, number][];
  private userCountSummary:[string, number][];

  private clientTimeSummary:[string, number][];
  private appServerTimeSummary:[string, number][];
  private reportTypeTimeSummary:[string, number][];
  private reportTimeSummary:[string, number][];
  private portTimeSummary:[string, number][];
  private userTimeSummary:[string, number][];

  private selectionTitle = '';
  private selectionValue = '';

  private isSelected = function (GenStatRecord) {
    return false
  };

  constructor(private genStatDataService:GenStatDataService) {
  }

  private count(data:GenStatRecord[],
                keyGen:(GenStatRecord)=>string,
                accGen:(GenStatRecord)=>number):[string, number][] {
    return <[string, number][]>_(data.reduce(
      function (acc, r) {
        var key = keyGen(r);
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += accGen(r);
        return acc;
      }, {}))
      .toPairs()
      .sortBy(function (v) {
        return -v[1];
      })
      .value();
  }

  private updateSummaries():void {
    this.clientCountSummary = this.count(this.records, gsr => gsr.client, gsr => 1);
    this.appServerCountSummary = this.count(this.records, gsr => gsr.appServer, gsr => 1);
    this.reportTypeCountSummary = this.count(this.records, gsr => gsr.reportType, gsr => 1);
    this.reportCountSummary = this.count(this.records, gsr => gsr.report, gsr => 1);
    this.portCountSummary = this.count(this.records, gsr => gsr.port, gsr => 1);
    this.userCountSummary = this.count(this.records, gsr => gsr.user, gsr => 1);
    this.clientTimeSummary = this.count(this.records, gsr => gsr.client, gsr => gsr.reqTime);
    this.appServerTimeSummary = this.count(this.records, gsr => gsr.appServer, gsr => gsr.reqTime);
    this.reportTypeTimeSummary = this.count(this.records, gsr => gsr.reportType, gsr => gsr.reqTime);
    this.reportTimeSummary = this.count(this.records, gsr => gsr.report, gsr => gsr.reqTime);
    this.portTimeSummary = this.count(this.records, gsr => gsr.port, gsr => gsr.reqTime);
    this.userTimeSummary = this.count(this.records, gsr => gsr.user, gsr => gsr.reqTime);
  }

  ngOnInit():void {
    this.genStatDataService.getRecords().then((data:GenStatRecord[]) => {
      this.records = this.originalRecords = data;
      this.updateSummaries();
    });
  }

  private onZoomChanged(range:[number,number]) {
    let min = range[0], max = range[1];
    if (min === null && max === null) {
      this.records = this.originalRecords;
    } else {
      if (!Number.isFinite(min)) {
        min = Number.NEGATIVE_INFINITY;
      }
      if (!Number.isFinite(max)) {
        max = Number.POSITIVE_INFINITY;
      }
      this.records = this.originalRecords.filter((gsr:GenStatRecord) => {
        const ret = gsr.asofDate >= min && gsr.asofDate <= max;
        return ret;
      });
    }
    this.updateSummaries();
  }

  private onSummarySelected(info:[string,string]) {
    const title = info[0];
    const value = info[1];
    if (value == '') {
      return;
    }
    if (this.selectionTitle == title && this.selectionValue == value) {
      return;
    }
    switch (title) {
      case 'Client':
        this.isSelected = function (gsr:GenStatRecord) {
          return gsr.client == value;
        };
        break;
      case 'AppServer':
        this.isSelected = function (gsr:GenStatRecord) {
          return gsr.appServer == value;
        };
        break;
      case 'ReportType':
        this.isSelected = function (gsr:GenStatRecord) {
          return gsr.reportType == value;
        };
        break;
      case 'Report':
        this.isSelected = function (gsr:GenStatRecord) {
          return gsr.report == value;
        };
        break;
      case 'Portfolio':
        this.isSelected = function (gsr:GenStatRecord) {
          return gsr.port == value;
        };
        break;
      case 'User':
        this.isSelected = function (gsr:GenStatRecord) {
          return gsr.user == value;
        };
        break;
      default:
        this.isSelected = function (gsr:GenStatRecord) {
          return false;
        };
        break;
    }
    this.selectionTitle = title;
    this.selectionValue = value;
  }
}
