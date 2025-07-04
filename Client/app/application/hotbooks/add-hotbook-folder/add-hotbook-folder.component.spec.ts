import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHotbookFolderComponent } from './add-hotbook-folder.component';

describe('AddHotbookFolderComponent', () => {
  let component: AddHotbookFolderComponent;
  let fixture: ComponentFixture<AddHotbookFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHotbookFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHotbookFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
