/* tslint:disable:no-unused-variable */

import {
  TestBed,
  ComponentFixture,
  async,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { AppComponent } from './app.component.ts';
import { GenStatDataService } from './../utilities/gen-stat-data.service.ts';
import { GenStatRecord } from './../model/gen-stat-record';

class MockGenStatDataService {
  static gsr = new GenStatRecord('DMO', 'VARServer', 'NLAF_RPT', 1472648422443, 'VOL_DIFF_LINK', 'HCS-ALL-E',
    'navagarw', 'bendtsl001', 1, 12.0512475967407, 29148, 2004);

  getRecords():Promise<string> {
    return Promise.resolve([MockGenStatDataService.gsr]);
  }
}

describe('App: Vsm2a', () => {

  let fixture:ComponentFixture<AppComponent>;
  let comp:AppComponent;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, MockDetailsComponent, MockSummaryComponent],
      providers: [
        {provide: GenStatDataService, useClass: MockGenStatDataService},
      ]
    })
      .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges(); // trigger initial data binding
  });


  it('should create the app', async(() => {
    expect(comp).toBeTruthy();

  }));

  it('should get data on init', fakeAsync(() => {
    comp.ngOnInit();
    tick(); // MockGenStatDataService to resolve
    fixture.detectChanges(); // detectet and propogate the changes
    const detailsDebugElement = fixture.debugElement.query(By.css('app-details'));
    expect(detailsDebugElement.componentInstance.records[0]).toEqual(MockGenStatDataService.gsr);
  }));
});

////// Mock Children Components //////
// TODO: remove OnInit, OnChanges, SimpleChanges if we do not need them
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-details',
  template: 'details'
})
class MockDetailsComponent implements OnInit, OnChanges{
  @Input() records:GenStatRecord[];
  @Input() isSelected:(GenStatRecord)=>boolean;
  @Output() onZoomChanged = new EventEmitter<[number,number]>();

  constructor() {
    // console.log('constructor');
  }
  ngOnInit() {
    //console.log('ngOnInit');
    //console.log(this.records);
  }

  ngOnChanges(changes:SimpleChanges) {
    //console.log('ngOnChanges');
    //console.log(changes);
  }
}


@Component({
  selector: 'app-summary',
  template: 'summary'
})
class MockSummaryComponent {
  @Input() title:string;
  @Input() type:string;
  @Input() data:[string, number][];
  @Input() selectionTitle:string;
  @Input() selectionValue:string;
  @Output() onSummarySelected = new EventEmitter<[string, string]>();
}

