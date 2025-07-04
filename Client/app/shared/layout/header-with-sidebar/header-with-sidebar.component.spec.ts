import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderWithSidebarComponent } from './header-with-sidebar.component';

describe('HeaderWithSidebarComponent', () => {
  let component: HeaderWithSidebarComponent;
  let fixture: ComponentFixture<HeaderWithSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderWithSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderWithSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
