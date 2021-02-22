import { TestBed } from '@angular/core/testing';

import { UsermanagenetService } from './usermanagenet.service';

describe('UsermanagenetService', () => {
  let service: UsermanagenetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsermanagenetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
