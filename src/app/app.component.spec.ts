/* tslint:disable:no-unused-variable */

import {
  TestBed,
  async,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GenStatDataService } from './gen-stat-data.service';
import { GenStatRecord } from './gen-stat-record';

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
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: GenStatDataService, useClass: MockGenStatDataService},
      ]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));

  it(`should have as title = gsr.client`, fakeAsync(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    app.ngOnInit();
    tick();
    expect(app.title).toEqual(MockGenStatDataService.gsr.client);
  }));
});
