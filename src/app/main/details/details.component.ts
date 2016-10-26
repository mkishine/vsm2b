import { Component, Input, EventEmitter, Output } from '@angular/core';
import { GenStatRecord } from '../../model/gen-stat-record';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  @Input() records:GenStatRecord[];
  @Input() isSelected:(GenStatRecord)=>boolean;
  @Output() onZoomChanged = new EventEmitter<[number,number]>();

  private min:number = null;
  private max:number = null;

  private get isValid():boolean {
    return this.records && this.records.length > 0;
  }

  private get zoomedOut():boolean {
    return !this.min && !this.max;
  }

  private zoomNotify():void {
    const min = this.min === null ? null : +this.min;
    const max = this.max === null ? null : +this.max;
    this.onZoomChanged.emit([min, max]);
  }
  // tslint:disable:no-unused-variable
  private reset():void {
    this.min = this.max = null;
    this.zoomNotify();
  }
  // tslint:disable:no-unused-variable
  private setMin(min:number):void {
    min = min || null;
    if (this.min === min) {
      return;
    }
    this.min = min;
    this.zoomNotify();
  }
  // tslint:disable:no-unused-variable
  private setMax(max:number):void {
    max = max || null;
    if (this.max === max) {
      return;
    }
    this.max = max;
    this.zoomNotify();
  }
  // tslint:disable:no-unused-variable
  private getClass(gsr:GenStatRecord):string {
    return this.isSelected(gsr) ? 'highlight' : '';
  }
}
