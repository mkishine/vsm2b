/* tslint:disable:no-unused-variable */

import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import {
  Headers, BaseRequestOptions,
  Response, HttpModule, Http, XHRBackend, RequestMethod
} from '@angular/http';

import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import { GenStatDataService } from './gen-stat-data.service';

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
                ['a']
              ]
            }
          )));
      });

    let service:GenStatDataService = getTestBed().get(GenStatDataService);
    service.getRecords().then((x) => {
      expect(x).toBe('a');
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
