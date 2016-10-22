/* tslint:disable:no-unused-variable */

import {
  TestBed,
  async,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { AppComponent } from './app.component.ts';
import { GenStatDataService } from './../utilities/gen-stat-data.service.ts';
import { GenStatRecord } from './../model/gen-stat-record';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockGenStatDataService {
  static gsr = new GenStatRecord('DMO', 'VARServer', 'NLAF_RPT', 1472648422443, 'VOL_DIFF_LINK', 'HCS-ALL-E',
    'navagarw', 'bendtsl001', 1, 12.0512475967407, 29148, 2004);

  getRecords():Promise<string> {
    return Promise.resolve([MockGenStatDataService.gsr]);
  }
}

describe('App: Vsm2a', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        {provide: GenStatDataService, useClass: MockGenStatDataService},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  xit('should get data on init', fakeAsync(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    app.ngOnInit();
    tick();
    //TODO: figure out how to test this
    expect(1).toEqual(1);
  }));
});
