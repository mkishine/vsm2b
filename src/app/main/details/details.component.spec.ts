/* tslint:disable:no-unused-variable */
import { DebugElement }    from '@angular/core';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DetailsComponent } from './details.component.ts';
import { GenStatRecord } from '../../model/gen-stat-record';

const gsrs = [
  new GenStatRecord('CL1', 'VARServer', 'NLAF_RPT', 1, 'r', 'p', 'u', 'h', 1, 1.0, 29148, 2004),
  new GenStatRecord('CL1', 'VARServer', 'NLAF_RPT', 3, 'r', 'p', 'u', 'h', 1, 3.0, 29148, 2004),
  new GenStatRecord('CL2', 'VARServer', 'NLAF_RPT', 5, 'r', 'p', 'u', 'h', 1, 5.0, 29148, 2004),
];

function noSelection(r:GenStatRecord) {
  return false;
}
describe('Component: Details', () => {
  let fixture:ComponentFixture<DetailsComponent>;
  let comp:DetailsComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsComponent]
    })
      .compileComponents(); // compile template and css
    fixture = TestBed.createComponent(DetailsComponent);
    comp = fixture.componentInstance;
    comp.records = gsrs;
    comp.isSelected = noSelection;
    fixture.detectChanges(); // trigger initial data binding
  }));

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should hava a few rows of data', () => {
    const rowEls = fixture.debugElement.queryAll(By.css('tr'));
    expect(rowEls.length).toBe(gsrs.length + 1, 'data length');
    const highlightedRowsEls = fixture.debugElement.queryAll(By.css('.highlight'));
    expect(highlightedRowsEls.length).toBe(0, 'no highlighted rows');
  });

  it('some of the data may be highlighted', () => {
    comp.isSelected = (r:GenStatRecord)=> {
      return r.client === 'CL1';
    };
    fixture.detectChanges();
    const highlightedRowsEls = fixture.debugElement.queryAll(By.css('.highlight'));
    expect(highlightedRowsEls.length).toBe(2, 'client CL1');
  });
  describe('min/max controls', ()=> {
    let minMaxActual:[number,number];
    let minEdit:DebugElement;
    let maxEdit:DebugElement;
    let btn:DebugElement;
    beforeEach(()=> {
      minMaxActual = null;
      comp.onZoomChanged.subscribe((event:[number, number]) => minMaxActual = event);
      minEdit = fixture.debugElement.query(By.css('[placeholder=min]'));
      maxEdit = fixture.debugElement.query(By.css('[placeholder=max]'));
      btn = fixture.debugElement.query(By.css('button'));

    });
    it('min edit box', () => {
      minEdit.nativeElement.value = '2';
      minEdit.triggerEventHandler('blur', null);
      expect(minMaxActual).toEqual([2, null]);
    });
    it('max edit box', () => {
      maxEdit.nativeElement.value = '4';
      maxEdit.triggerEventHandler('blur', null);
      expect(minMaxActual).toEqual([null, 4]);
    });
    it('min and max edit box', () => {
      minEdit.nativeElement.value = '2';
      minEdit.triggerEventHandler('blur', null);
      maxEdit.nativeElement.value = '4';
      maxEdit.triggerEventHandler('blur', null);
      expect(minMaxActual).toEqual([2, 4]);
    });
    it('button is not clickable in the initial state', () => {
      minEdit.nativeElement.value = '2';
      minEdit.triggerEventHandler('blur', null);
      maxEdit.nativeElement.value = '4';
      maxEdit.triggerEventHandler('blur', null);
      btn.triggerEventHandler('click', null);
      expect(minMaxActual).toEqual([null, null]);
    });
  });
});
