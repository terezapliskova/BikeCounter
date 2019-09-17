/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CordovaService } from './cordova.service';

describe('Service: Cordova', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CordovaService]
    });
  });

  it('should ...', inject([CordovaService], (service: CordovaService) => {
    expect(service).toBeTruthy();
  }));
});
