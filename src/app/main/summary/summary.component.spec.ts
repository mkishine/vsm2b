/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SummaryComponent } from './summary.component.ts';

describe('Component: Summary', () => {
  let fixture:ComponentFixture<SummaryComponent>;
  let comp:SummaryComponent;
  const title = 'User';
  const type = 'Time';
  const data:[string, number][] = [['a', 1], ['b', 2], ['c', 3]];

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [SummaryComponent],
    })
      .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryComponent);
    comp = fixture.componentInstance;

    comp.title = title;
    comp.type = type;
    comp.data = data;
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should display title', () => {
    const titleEl = fixture.debugElement.query(By.css('.summary-title'));
    expect(titleEl.nativeElement.textContent).toBe(title);
  });

  it('should display type', () => {
    const typeEl = fixture.debugElement.query(By.css('.summary-type'));
    expect(typeEl.nativeElement.textContent).toBe(type);
  });

  it('should display summary data', () => {
    let xEls = fixture.debugElement.queryAll(By.css('.summary-x'));
    expect(xEls.length).toBe(data.length, 'check data length');
    expect(xEls[0].nativeElement.textContent).toBe(data[0][0]);
  });

  it('should allow data selection', () => {
    const label = data[1][0];
    const id = `#${comp.idBase}${label}`;
    const expectedEvent = [title, label];
    let observedEvent:[string, string];
    let rbEl = fixture.debugElement.query(By.css(id));
    comp.onSummarySelected.subscribe((event:[string, string]) => observedEvent = event);
    rbEl.triggerEventHandler('click', null);
    expect(expectedEvent).toEqual(observedEvent);
  });
});
