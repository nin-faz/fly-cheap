import { TestBed } from '@angular/core/testing';

import { MyBookingsService } from './my-bookings';

describe('MyBookingsService', () => {
  let service: MyBookingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyBookingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
