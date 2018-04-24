import {Component, NgZone, OnInit} from '@angular/core';

import {JavaComponent} from "../java-component";
import {JavaComponentService} from "../java-component.service";
import {State} from "../state.enum";
import {Scope} from "../scope.enum";
import "rxjs/add/observable/dom/webSocket";

@Component({
  selector: 'app-component-manager',
  templateUrl: './component-manager.component.html',
  styleUrls: ['./component-manager.component.css']
})
export class ComponentManagerComponent implements OnInit {

  javaComponents: JavaComponent[] = [];
  state = State;
  scope = Scope;

  constructor(private javaComponentService: JavaComponentService, private zone: NgZone) {
  }

  ngOnInit() {
    this.getJavaComponents();
    this.getJavaComponentsLog();
  }

  getJavaComponents() {
    this.javaComponentService.getJavaComponents()
      .subscribe(javaComponents => {
        javaComponents.forEach(javaComponent => { // add new components
          if (!this.javaComponents.some(c => c.id === javaComponent.id)) {
            this.javaComponents.push(javaComponent)
          }
        });
        this.javaComponents.forEach(javaComponent => { // set state of missing components to unloaded
          if (!javaComponents.some(c => c.id === javaComponent.id)) {
            javaComponent.state = State.Unloaded
          }
        });
      });
  }

  getJavaComponentsLog() {
    this.javaComponentService.getJavaComponentsLog().subscribe({
      next: javaComponentLog => {
        let component = this.javaComponents.find(c => c.id === javaComponentLog.id);
        if (component) {
          component.logMessages.push(javaComponentLog.message);
          this.zone.run(() => null); // Update view: https://gist.github.com/ComFreek/fb6d80de444004393214
        }
      }
    });
  }

  uploadJavaComponent(file: File) {
    if (file) {
      this.javaComponentService.uploadJavaComponent(file)
        .subscribe(javaComponent => {
          if (javaComponent)
            this.javaComponents.push(javaComponent)
        });
    }
  }

  startJavaComponent(id: String) {
    this.javaComponentService.startJavaComponent(id)
      .subscribe(javaComponent => {
        if (javaComponent) {
          const index = this.javaComponents.findIndex((component) => component.id === javaComponent.id);
          if (index > -1) this.javaComponents[index].state = javaComponent.state;
        }
      });
  }

  stopJavaComponent(id: String) {
    this.javaComponentService.stopJavaComponent(id)
      .subscribe(javaComponent => {
        if (javaComponent) {
          const index = this.javaComponents.findIndex((component) => component.id === javaComponent.id);
          if (index > -1) this.javaComponents[index].state = javaComponent.state;
        }
      });
  }

  unloadJavaComponent(id: String) {
    this.javaComponentService.unloadJavaComponent(id)
      .subscribe(javaComponent => {
        if (javaComponent) {
          const index = this.javaComponents.findIndex((component) => component.id === javaComponent.id);
          if (index > -1) this.javaComponents[index].state = javaComponent.state;
        }
        this.getJavaComponents()
      });
  }

  setScope(id: String, scope: Scope) {
    this.javaComponentService.setScope(id, scope)
      .subscribe(javaComponent => {
        if (javaComponent) {
          const index = this.javaComponents.findIndex((component) => component.id === javaComponent.id);
          if (index > -1) this.javaComponents[index] = javaComponent;
        }
      });
  }
}
