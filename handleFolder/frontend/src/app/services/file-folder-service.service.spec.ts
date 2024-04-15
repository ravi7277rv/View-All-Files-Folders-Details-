import { TestBed } from '@angular/core/testing';

import { FileFolderServiceService } from './file-folder-service.service';

describe('FileFolderServiceService', () => {
  let service: FileFolderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileFolderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
