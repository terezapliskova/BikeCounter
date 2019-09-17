/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LocalAuthService } from './local-auth.service';

describe('Service: Auth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalAuthService]
    });
  });

  it('should ...', inject([LocalAuthService], (service: LocalAuthService) => {
    expect(service).toBeTruthy();
  }));
});
