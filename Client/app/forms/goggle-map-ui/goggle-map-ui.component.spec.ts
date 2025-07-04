import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoggleMapUiComponent } from './goggle-map-ui.component';

describe('GoggleMapUiComponent', () => {
  let component: GoggleMapUiComponent;
  let fixture: ComponentFixture<GoggleMapUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoggleMapUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoggleMapUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
