import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileuploadUiComponent } from './fileupload-ui.component';

describe('FileuploadUiComponent', () => {
  let component: FileuploadUiComponent;
  let fixture: ComponentFixture<FileuploadUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileuploadUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileuploadUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
