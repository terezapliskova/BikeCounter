/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UsersFirebaseService } from './users-firebase.service';

describe('Service: UsersFirebase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersFirebaseService]
    });
  });

  it('should ...', inject([UsersFirebaseService], (service: UsersFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
