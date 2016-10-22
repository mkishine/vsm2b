import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnChanges {
  @Input() title:string;
  @Input() type:string;
  @Input() data:[string, number][];
  @Input() selectionTitle:string;
  @Input() selectionValue:string;
  @Output() onSummarySelected = new EventEmitter<[string, string]>();

  public idBase:string;

  private control:FormControl;
  private formGroup:FormGroup;

  ngOnInit() {
    this.idBase = `summary_${this.title}_${this.type}_`;
    this.control = new FormControl();
    let controls = {};
    controls[this.idBase] = this.control;
    this.formGroup = new FormGroup(controls);
  }

  ngOnChanges(changes:SimpleChanges) {
    if (!this.control) {
      return;
    }
    if (!changes['selectionValue']) {
      return;
    }
    const newTitle = changes['selectionTitle'] ? changes['selectionTitle'].currentValue : this.title;
    const newValue = newTitle === this.title ? changes['selectionValue'].currentValue : '';
    if (newValue === this.control.value) {
      return;
    }
    this.control.reset(newValue);
  }

  /* tslint:disable:no-unused-variable */
  private onClick(newValue:string) {
    this.onSummarySelected.emit([this.title, newValue]);
  }
}
