import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalMatchComponent } from './metal-match.component';

describe('MetalMatchComponent', () => {
  let component: MetalMatchComponent;
  let fixture: ComponentFixture<MetalMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetalMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
