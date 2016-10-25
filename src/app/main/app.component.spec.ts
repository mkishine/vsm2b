/* tslint:disable:no-unused-variable */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { AppComponent } from './app.component.ts';
import { GenStatDataService } from './../utilities/gen-stat-data.service.ts';
import { GenStatRecord } from './../model/gen-stat-record';

// Helper objects

const gsrs = [
  new GenStatRecord('CL1', 'VARServer', 'NLAF_RPT', 1, 'r', 'p', 'u', 'h', 1, 1.0, 29148, 2004),
  new GenStatRecord('CL1', 'VARServer', 'NLAF_RPT', 3, 'r', 'p', 'u', 'h', 1, 3.0, 29148, 2004),
  new GenStatRecord('CL2', 'VARServer', 'NLAF_RPT', 5, 'r', 'p', 'u', 'h', 1, 5.0, 29148, 2004),
];

class MockGenStatDataService {
  getRecords():Promise<string> {
    return Promise.resolve(gsrs);
  }
}

@Component({
  selector: 'app-details',
  template: 'details'
})
class MockDetailsComponent {
  @Input() records:GenStatRecord[];
  @Input() isSelected:(GenStatRecord)=>boolean;
  @Output() onZoomChanged = new EventEmitter<[number,number]>();
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


describe('App: Vsm2a', () => {
  let fixture:ComponentFixture<AppComponent>;
  let comp:AppComponent;
  let detComp:MockDetailsComponent;
  let sumCompClientCount:MockSummaryComponent;
  let sumCompClientTime:MockSummaryComponent;
  let sumCompAppServerCount:MockSummaryComponent;
  let sumCompAppServerTime:MockSummaryComponent;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, MockDetailsComponent, MockSummaryComponent],
      providers: [
        {provide: GenStatDataService, useClass: MockGenStatDataService},
      ]
    })
      .compileComponents(); // compile template and css
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges(); // trigger initial data binding, and onInit
    tick(); // force getQuotes to be propagated
    fixture.detectChanges(); // update view with new data
    const detailsDebugElement = fixture.debugElement.query(By.css('app-details'));
    detComp = detailsDebugElement.componentInstance;
    const summaryDebugElements = fixture.debugElement.queryAll(By.css('app-summary'));
    let sumComps:{[key:string]:MockSummaryComponent} = {};
    summaryDebugElements.forEach((el)=> {
      const sumComp = el.componentInstance;
      const title = sumComp.title;
      const type = sumComp.type;
      sumComps[`${title}/${type}`] = sumComp;
    });
    sumCompClientCount = sumComps['Client/Count'];
    sumCompClientTime = sumComps['Client/Time'];
    sumCompAppServerCount = sumComps['AppServer/Count'];
    sumCompAppServerTime = sumComps['AppServer/Time'];
  }));

  it('should pass data to details on init', () => {
    const detailsDebugElement = fixture.debugElement.query(By.css('app-details'));
    expect(detailsDebugElement.componentInstance.records).toEqual(gsrs);
  });
  it('should pass construct a few summary componenbts', () => {
    const summaryDebugElements = fixture.debugElement.queryAll(By.css('app-summary'));
    const expected = [
      ['Client', 'Count'],
      ['AppServer', 'Count'],
      ['ReportType', 'Count'],
      ['Report', 'Count'],
      ['Portfolio', 'Count'],
      ['User', 'Count'],
      ['Client', 'Time'],
      ['AppServer', 'Time'],
      ['ReportType', 'Time'],
      ['Report', 'Time'],
      ['Portfolio', 'Time'],
      ['User', 'Time']
    ];
    let actual = summaryDebugElements.map((el)=> {
      const sumComp = el.componentInstance;
      const title = sumComp.title;
      const type = sumComp.type;
      return [title, type];
    });
    expect(expected).toEqual(actual);
  });
  describe('can filter data by time', () => {
    it('[min, max]', ()=> {
      detComp.onZoomChanged.emit([2, 4]);
      fixture.detectChanges(); // update view with new data
      expect(detComp.records).toEqual([gsrs[1]], 'detail');
      expect(sumCompClientCount.data).toEqual([['CL1', 1]], 'Client/Count summary');
      expect(sumCompClientTime.data).toEqual([['CL1', 3]], 'Client/Time summary');
      expect(sumCompAppServerCount.data).toEqual([['VARServer', 1]], 'AppServer/Count summary');
      expect(sumCompAppServerTime.data).toEqual([['VARServer', 3]], 'AppServer/Time summary');
    });
    it('[min, min]', ()=> {
      detComp.onZoomChanged.emit([3, 3]);
      fixture.detectChanges(); // update view with new data
      expect(detComp.records).toEqual([gsrs[1]]);
      expect(sumCompClientCount.data).toEqual([['CL1', 1]], 'Client/Count summary');
      expect(sumCompClientTime.data).toEqual([['CL1', 3]], 'Client/Time summary');
      expect(sumCompAppServerCount.data).toEqual([['VARServer', 1]], 'AppServer/Count summary');
      expect(sumCompAppServerTime.data).toEqual([['VARServer', 3]], 'AppServer/Time summary');
    });
    it('[min, null]', ()=> {
      detComp.onZoomChanged.emit([2, null]);
      fixture.detectChanges(); // update view with new data
      expect(detComp.records).toEqual([gsrs[1], gsrs[2]]);
      expect(sumCompClientCount.data).toEqual([['CL1', 1], ['CL2', 1]], 'Client/Count summary');
      expect(sumCompClientTime.data).toEqual([['CL2', 5], ['CL1', 3]], 'Client/Time summary');
      expect(sumCompAppServerCount.data).toEqual([['VARServer', 2]], 'AppServer/Count summary');
      expect(sumCompAppServerTime.data).toEqual([['VARServer', 8]], 'AppServer/Time summary');
    });
    it('[null, max]', ()=> {
      detComp.onZoomChanged.emit([null, 4]);
      fixture.detectChanges(); // update view with new data
      expect(detComp.records).toEqual([gsrs[0], gsrs[1]]);
      expect(sumCompClientCount.data).toEqual([['CL1', 2]], 'Client/Count summary');
      expect(sumCompClientTime.data).toEqual([['CL1', 4]], 'Client/Time summary');
      expect(sumCompAppServerCount.data).toEqual([['VARServer', 2]], 'AppServer/Count summary');
      expect(sumCompAppServerTime.data).toEqual([['VARServer', 4]], 'AppServer/Time summary');
    });
    it('[null, null]', ()=> {
      detComp.onZoomChanged.emit([null, null]);
      fixture.detectChanges();
      expect(detComp.records).toEqual(gsrs, 'detail');
      expect(sumCompClientCount.data).toEqual([['CL1', 2], ['CL2', 1]], 'Client/Count summary');
      expect(sumCompClientTime.data).toEqual([['CL2', 5], ['CL1', 4]], 'Client/Time summary');
      expect(sumCompAppServerCount.data).toEqual([['VARServer', 3]], 'AppServer/Count summary');
      expect(sumCompAppServerTime.data).toEqual([['VARServer', 9]], 'AppServer/Time summary');
    });
  });
  describe('can detect selection in summary component', () => {
    it('default behavior is no selection', () => {
      expect(gsrs.map(e=>detComp.isSelected(e))).toEqual([false, false, false]);
    });
    it('selecting Client CL1', () => {
      sumCompClientCount.onSummarySelected.emit(['Client', 'CL1']);
      fixture.detectChanges();
      expect(gsrs.map(e=>detComp.isSelected(e))).toEqual([true, true, false]);
    });
    it('selecting Client CL2', () => {
      sumCompClientCount.onSummarySelected.emit(['Client', 'CL2']);
      fixture.detectChanges();
      expect(gsrs.map(e=>detComp.isSelected(e))).toEqual([false, false, true]);
    });
    it('selecting abc xyz', () => {
      sumCompClientCount.onSummarySelected.emit(['abc', 'xyz']);
      fixture.detectChanges();
      expect(gsrs.map(e=>detComp.isSelected(e))).toEqual([false, false, false]);
      expect(sumCompClientCount.selectionTitle).toBe('abc');
      expect(sumCompClientCount.selectionValue).toBe('xyz');
      expect(sumCompClientTime.selectionTitle).toBe('abc');
      expect(sumCompClientTime.selectionValue).toBe('xyz');
      expect(sumCompAppServerCount.selectionTitle).toBe('abc');
      expect(sumCompAppServerCount.selectionValue).toBe('xyz');
      expect(sumCompAppServerTime.selectionTitle).toBe('abc');
      expect(sumCompAppServerTime.selectionValue).toBe('xyz');
    });
  });
});

