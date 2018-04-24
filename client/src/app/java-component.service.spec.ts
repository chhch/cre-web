import {inject, TestBed} from '@angular/core/testing';

import {JavaComponentService} from './java-component.service';

describe('JavaComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JavaComponentService]
    });
  });

  it('should be created', inject([JavaComponentService], (service: JavaComponentService) => {
    expect(service).toBeTruthy();
  }));
});
