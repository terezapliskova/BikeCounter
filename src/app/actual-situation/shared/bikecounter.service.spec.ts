/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BikecounterService } from './bikecounter.service';

describe('Service: Bikecounter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BikecounterService]
    });
  });

  it('should ...', inject([BikecounterService], (service: BikecounterService) => {
    expect(service).toBeTruthy();
  }));
});
