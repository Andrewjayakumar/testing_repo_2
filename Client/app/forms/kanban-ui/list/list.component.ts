import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CardSchema } from '../CardSchema';
import { ListSchema } from '../ListSchema';
import { CardStore } from '../CardStore';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    @Input() list: ListSchema;
    @Input() cardStore: CardStore;
    @Input() public dragallow: boolean;
    @Input() public groupid: string;

    displayAddCard = false;
    public card: CardSchema = {
        id: "",
        description: "",
        assignedResource: "",
        state: ""
    };
    constructor() { }
    toggleDisplayAddCard() {
        
        //this.card.id = null;
        //this.card.description = "task";
        //this.card.assignedResource = "none";
        //this.card.state = this.list.state;

        this.displayAddCard = !this.displayAddCard;
        this.onEnter(this.card);
    }
    ngOnInit(): void {
    }

    allowDrop($event) {
        $event.preventDefault();
    }

    drop($event) {
        
        $event.preventDefault();
        const id = $event.dataTransfer.getData('id');
        const state = $event.dataTransfer.getData('state');

        this.list.cards.push(id);

        this.cardStore.deleteCard(id, state, this.groupid, true, this.list.state);
        //let target = $event.target;
        //const targetClassName = target.className;


        //while (target.className !== 'list') {
        //    target = target.parentNode;
        //}
        //target = target.querySelector('.cards');


        //if (targetClassName === 'card') {
        //    $event.target.parentNode.insertBefore(document.getElementById(data), $event.target);
        //} else if (targetClassName === 'list__title') {
        //    if (target.children.length) {
        //        target.insertBefore(document.getElementById(data), target.children[0]);
        //    } else {
        //        target.appendChild(document.getElementById(data));
        //    }
        //} else {
        //    target.appendChild(document.getElementById(data));
        //}

    }

    onEnter(Card: CardSchema) {
        
        const cardId = this.cardStore.newCard();
        this.list.cards.push(cardId);
    }
}
