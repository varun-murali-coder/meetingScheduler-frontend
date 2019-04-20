import { TestBed } from '@angular/core/testing';

import { DashServiceService } from './dash-service.service';

describe('DashServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashServiceService = TestBed.get(DashServiceService);
    expect(service).toBeTruthy();
  });
});
