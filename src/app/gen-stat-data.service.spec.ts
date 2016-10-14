/* tslint:disable:no-unused-variable */

import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import {
  Headers, BaseRequestOptions,
  Response, HttpModule, Http, XHRBackend, RequestMethod
} from '@angular/http';

import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import { GenStatDataService } from './gen-stat-data.service';
import { GenStatRecord } from './gen-stat-record';

describe('Service: GenStatData', () => {
  let mockBackend:MockBackend;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        GenStatDataService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend:XHRBackend, defaultOptions:BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }
      ],
      imports: [
        HttpModule
      ]
    });
    mockBackend = getTestBed().get(MockBackend);
  }));

  it('should exist (using inject)', inject([GenStatDataService], (service:GenStatDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should exist (using getTestBed().get())', done => {
    let service = getTestBed().get(GenStatDataService);
    expect(service).toBeDefined();
    done();
  });

  it('should return value', done => {
    mockBackend.connections.subscribe(
      (connection:MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
              status: 200,
              body: [
                ['client', 'app_server', 'report_type', 'asof_date', 'report', 'port', 'user', 'host', 'flags',
                  'req_time', 'pid', 'req_no'],
                ['DMO', 'VARServer', 'NLAF_RPT', 1472648422443, 'VOL_DIFF_LINK', 'HCS-ALL-E', 'navagarw', 'bendtsl001', '1',
                  '12.0512475967407', '29148', '2004']
              ]
            }
          )));
      });

    let service:GenStatDataService = getTestBed().get(GenStatDataService);
    service.getRecords().then((x:GenStatRecord[]) => {
      expect(x.length).toBe(1);
      expect(x[0].client).toBe('DMO');
      done();
    }, (error) => {
      // never get here
      expect(1).toBe(2);
      done();
    });
  });

  it('should handle error', done => {
    mockBackend.connections.subscribe(
      (connection:MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
              status: 404
            }
          )));
      });

    let service:GenStatDataService = getTestBed().get(GenStatDataService);
    service.getRecords().then((success) => {
      // never get here
      expect(1).toBe(1);
      done();
    }, (error) => {
      expect(error.status).toBe(404);
      done();
    });
  });

});
