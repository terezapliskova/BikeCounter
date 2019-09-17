/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FirebaseLocalitiesService } from './firebase-localities.service';

describe('Service: FirebaseLocalities', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseLocalitiesService]
    });
  });

  it('should ...', inject([FirebaseLocalitiesService], (service: FirebaseLocalitiesService) => {
    expect(service).toBeTruthy();
  }));
});
