import {Injectable} from '@angular/core';
import {IAlert} from "./ialert";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";

@Injectable()
export class AlertService {

  alerts: IAlert[] = [];
  private idUseGetter: number = 0;

  constructor() {
  }

  addAlert(alertMessage: string) {
    this.alerts.push({
      id: this.getId(),
      type: 'secondary',
      message: alertMessage,
    })
  }

  addInfo(alertMessage: string) {
    const id: number = this.getId();
    this.alerts.push({
      id: id,
      type: 'info',
      message: alertMessage,
    });

    setTimeout(() => {
      this.alerts.splice(this.alerts.findIndex(a => a.id == id), 1)
    }, 5000)
  }

  private getId(): number {
    return this.idUseGetter++
  }

}
