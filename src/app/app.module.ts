import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DetailsComponent } from './details/details.component';
import { SummaryComponent } from './summary/summary.component';

import { GenStatDataService } from './gen-stat-data.service';

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
