import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ComponentManagerComponent} from './component-manager.component';

describe('ComponentManagerComponent', () => {
  let component: ComponentManagerComponent;
  let fixture: ComponentFixture<ComponentManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
