declare var require;
import { Component, Input, OnInit } from '@angular/core';
import { CardSchema } from '../cardschema';
import { CardStore } from '../CardStore';
const _ = require('lodash');

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() cardId: string;
  @Input() cardStore: CardStore;;
  @Input() allowdrag: boolean = true;
  @Input() titlegrp: string = "group";
  @Input() resourcegrp: string = "none";
  @Input() list: any = [];
  @Input() public groupid: string;
  @Input() public AuthService: any;
  @Input() FormCardUI:any;
  @Input() CardformGroup:any;
  
  cardData: any = {};
  constructor() { }

  ngOnInit() {
    this.cardData = this.cardStore.cards[this.cardId];
  }
  setdropData() {
    return JSON.stringify({ id: this.cardId, state: this.cardData[this.cardStore.state] });
  }
  dragStart(ev, state) {
    //ev.dataTransfer.effectAllowed = "all";
    //ev.dataTransfer.dropEffect = "move";
    
    //ev.dataTransfer.setData('id', ev.target.id);
    //ev.dataTransfer.setData('state', state);
    //ev.target.style.border = "1px solid #cccccc";
  }
  dragEnd(ev, state) {
    //ev.dataTransfer.effectAllowed = "all";
    //ev.dataTransfer.dropEffect = "move";

    
    //ev.dataTransfer.setData('id', ev.target.id);
    //ev.dataTransfer.setData('state', state);
    //ev.target.style.border = "none";
}
  getTitle(card: any) {
    return card[this.cardStore.title];
  }
  getDescription(card: any) {
    return card[this.cardStore.description];
  }
  getImage(card: any) {
    return card[this.cardStore.image];
  }
}
