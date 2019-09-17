/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExportService } from './export.service';

describe('Service: Pdf', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportService]
    });
  });

  it('should ...', inject([ExportService], (service: ExportService) => {
    expect(service).toBeTruthy();
  }));
});
