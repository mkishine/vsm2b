import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { GenStatRecord } from './../model/gen-stat-record';
import { GenStatRecordListBuilder } from './gen-stat-record-list-builder';

@Injectable()
export class GenStatDataService {

  constructor(private http:Http) {
  }

  getRecords():Promise<GenStatRecord[]> {
    return this.http.get('/gen_stat_dump.BEN.20160831T0900-20160831T1000.json')
      .toPromise()
      .then((response) => {
        if (response.ok) {
          let rawRecords = response.json();
          let builder = new GenStatRecordListBuilder();
          let records = builder.buildGenStatRecordList(rawRecords);
          return records;
        } else {
          return this.handleError(response);
        }
      })
      .catch(this.handleError);
  }
  private handleError(error:any):Promise<any> {
    return Promise.reject({
      status: error.status || 0,
      statusText: error.statusText || ''
    });
  }
}

