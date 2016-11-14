import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './main/app.component.ts';
import { DetailsChartComponent } from './main/details/details_chart.component';
import { SummaryChartComponent } from './main/summary/summary_chart.component';

import { GenStatDataService } from './utilities/gen-stat-data.service.ts';

import {
  OnChangesParentComponent,
  OnChangesComponent
} from './sandbox/on-changes.component';

import { ChartModule } from 'angular2-highcharts';
import { ChartsExample } from './sandbox/charts-example.component';

let bootstrapComponent:any = AppComponent;
let declarations:any[] = [AppComponent, DetailsChartComponent, SummaryChartComponent];
let imports:any[] =  [BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, ChartModule];
let providers:any[] = [GenStatDataService];
if (/\bbootstrap=OnChangesParentComponent\b/.test(location.search)) {
  declarations = [OnChangesParentComponent, OnChangesComponent];
  imports = [BrowserModule, FormsModule, ReactiveFormsModule];
  providers = [];
  bootstrapComponent = OnChangesParentComponent;
} else if (/\bbootstrap=ChartsExample\b/.test(location.search)) {
  declarations = [ChartsExample, SummaryChartComponent];
  imports = [BrowserModule, ChartModule];
  providers = [];
  bootstrapComponent = ChartsExample;
}
@NgModule({
  declarations: declarations,
  imports: imports,
  providers: providers,
  bootstrap: [bootstrapComponent]
})
export class AppModule {
}
