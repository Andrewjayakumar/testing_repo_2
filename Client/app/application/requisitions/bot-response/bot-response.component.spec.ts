import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotResponseComponent } from './bot-response.component';

describe('BotResponseComponent', () => {
  let component: BotResponseComponent;
  let fixture: ComponentFixture<BotResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
