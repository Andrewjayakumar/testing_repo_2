import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGPTComponent } from './chat-gpt.component';

describe('ChatGPTComponent', () => {
  let component: ChatGPTComponent;
  let fixture: ComponentFixture<ChatGPTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatGPTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
