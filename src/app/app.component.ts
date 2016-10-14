import { Component, OnInit } from '@angular/core';
import { GenStatDataService } from './gen-stat-data.service';
import { GenStatRecord } from './gen-stat-record';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  constructor(private genStatDataService: GenStatDataService) {
  }

  ngOnInit(): void {
    this.genStatDataService.getRecords().then((data:GenStatRecord[]) => {
      this.title = data[0].client;
    });
  }
}
