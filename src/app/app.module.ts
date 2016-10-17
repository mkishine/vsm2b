import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './main/app.component.ts';
import { DetailsComponent } from './main/details/details.component';
import { SummaryComponent } from './main/summary/summary.component';

import { GenStatDataService } from './utilities/gen-stat-data.service.ts';

import {
  OnChangesParentComponent,
  OnChangesComponent
} from './sandbox/on-changes.component';

let bootstrapComponent:any = AppComponent;
let declarations:any[] = [AppComponent, DetailsComponent, SummaryComponent];
if (/\bbootstrap=OnChangesParentComponent\b/.test(location.search)) {
  bootstrapComponent = OnChangesParentComponent;
  declarations = [OnChangesParentComponent, OnChangesComponent];
}
@NgModule({
  declarations: declarations,
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [
    GenStatDataService
  ],
  bootstrap: [bootstrapComponent]
})
export class AppModule {
}
