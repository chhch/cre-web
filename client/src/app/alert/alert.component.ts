import {Component, Input, OnInit} from '@angular/core';
import {IAlert} from "../ialert";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input()
  public alerts: Array<IAlert> = [];

  ngOnInit() {
  }

  constructor() {
  }

  public closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

}

