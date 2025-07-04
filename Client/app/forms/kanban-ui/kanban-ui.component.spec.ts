import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanUiComponent } from './kanban-ui.component';

describe('KanbanUiComponent', () => {
  let component: KanbanUiComponent;
  let fixture: ComponentFixture<KanbanUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KanbanUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
