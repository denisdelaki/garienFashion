import { TestBed } from '@angular/core/testing';

import { TailoringService } from './tailoring.service';

describe('TailoringService', () => {
  let service: TailoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TailoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
