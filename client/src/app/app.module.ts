import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ComponentManagerComponent} from './component-manager/component-manager.component';
import {JavaComponentService} from "./java-component.service";
import {HttpClientModule} from "@angular/common/http";
import {AlertComponent} from './alert/alert.component';
import {AlertService} from "./alert.service";


@NgModule({
  declarations: [
    AppComponent,
    ComponentManagerComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, NgbModule.forRoot()
  ],
  providers: [JavaComponentService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
