import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenStatDataService {

  constructor(private http:Http) {
  }

  getRecords():Promise<string> {
    return this.http.get('/gen_stat_dump.BEN.20160831T0900-20160831T1000.json')
      .toPromise()
      .then((response) => {
        // TODO: convert response.json() into GenStatRecord[]
        if (response.ok) {
          let x:string = response.json()[0][0];
          return x;
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
