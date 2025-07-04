import { CardSchema } from './cardschema';

export class CardStore {
  cards: Object = {};
  resource: any = [];
  lastid = -1;
  lists: any = [];
  groups: any = [];

  _opened: boolean = false;

  state: string;
  title: any;
  description: any;
  image: any;
  html: any;
  mappingFields: any = [];

  control: any;

  addCardProp: any = {
    "key": "newcard",
    "Name": "Grid",
    "label": "Field Mapping",
    "icon": "fa fa-table",
    "type": "grid",
    "width": 12,
    "order": 2,
    "viewtype": "grid",
    "showinlist": false,
    "haschildren": true,
    "hasdatasource": true,
    "isTableView": true,
    "refresh": false,
    "children": [
      {
        "id": "816da566-f54a-0846-ae78-717fd5637718",
        "key": "key",
        "Name": "Textbox",
        "label": "key",
        "placeholder": "key",
        "icon": "fa fa-text-width",
        "type": "textbox",
        "width": 6,
        "order": 1,
        "require": true,
        "showinlist": true,
        "haschildren": false,
        "isTableView": true,
        "hasdatasource": false,
        "uuid": 7230921929423
      },
      {
        "id": "99860239-1230-09c5-fe2e-d35dsddc84d0",
        "key": "value",
        "Name": "Textbox",
        "label": "value",
        "placeholder": "value",
        "icon": "fa fa-chevron-circle-down",
        "type": "dropdown",
        "width": 6,
        "order": 2,
        "textfield": "key",
        "valuefield": "value",
        "require": true,
        "showinlist": true,
        "haschildren": false,
        "hasdatasource": true,
        "isTableView": true,
        "apiurl": "",
        "optionlist": [],
        "uuid": 1867456457486
      },
      {
        "key": "isEmail",
        "Name": "Checkbox",
        "label": "isEmail",
        "placeholder": "isEmail",
        "icon": "fa fa-check-square-o",
        "type": "checkbox",
        "width": 6,
        "order": 3,
        "require": false,
        "showinlist": false,
        "haschildren": false,
        "isTableView": true,
        "hasdatasource": false,
        "id": "77c8eef7-d9ad-fcef-1d35-e5ce5fe3712d",
        "uuid": 1791745601463
      },
      {
        "key": "isIcon",
        "Name": "Checkbox",
        "label": "isIcon",
        "placeholder": "isIcon",
        "icon": "fa fa-check-square-o",
        "type": "checkbox",
        "width": 6,
        "order": 3,
        "require": false,
        "showinlist": false,
        "haschildren": false,
        "isTableView": true,
        "hasdatasource": false,
        "id": "77c8eef7-d9ad-fcef-1d35-e5ce5fe3712d",
        "uuid": 1791745601463
      }
    ],
    "id": "e07a0c94-33eb-2793-3096-55526762a585",
    "uuid": 41051925656908
  }
  addCardPropData: any = {
    "newcard": [
      {
        "key": "Title",
        "id": "41b155c2-d326-d94e-bf51-de9b9fdb35db",
        "value": "",
        "isEmail": false,
        "isIcon": false
      },
      {
        "key": "Description",
        "id": "aa3bb191-977e-5700-3d9d-23854b04af24",
        "value": "",
        "isEmail": false,
        "isIcon": false
      },
      {
        "key": "PictureUrl",
        "id": "4c170c38-4f78-9347-985d-27ab6b26282c",
        "value": "",
        "isEmail": false,
        "isIcon": false
      }
    ]
  };
  constructor() { }

  _addCard(state) {
    
    var id = String(++this.lastid);

    var data : any = {}
    this.addCardPropData["newcard"].forEach(item => {
      if (item.key == "Title" && this.title != "")
        data[this.title] = item.value;
      else if (item.key == "Description" && this.description != "")
        data[this.description] = item.value;
      else if (item.key == "PictureUrl" && this.image != "")
        data[this.image] = item.value;
      else
        data[item.key] = item.value;
    })
    data[this.state] = state;
    this.cards[id] = JSON.parse(JSON.stringify(data));
    return (id);
  }
  removedCard: CardSchema = {
    id: "-1",
    description: "",
    assignedResource: "none",
    state: ""
  }
  getCard(cardId: string) {
    if (cardId == "-1")
      return this.removedCard;
    else
      return this.cards[cardId];
  }
  deleteCard(cardId: string, state, groupid, move: boolean = false, newstate: string = "") {
    
    var card = null;
    //this.lists[groupid].forEach(list => {
    this.lists.forEach(list => {
      if (list.state == state) {
        //delete list.cards[cardId];
        //return;
        Object.keys(list.cards).forEach(index => {
          if (list.cards[index] == cardId) {
            delete list.cards[index];
            return;
          }
        });
      }
    });

    if (!move) {
      Object.keys(this.cards).forEach(index => {
        if (index == cardId) {
          delete this.cards[index];
        }
      });
    }

    if (newstate != "") {
      Object.keys(this.cards).forEach(index => {
        if (index == cardId) {
          card = this.cards[index];
          card[this.state] = newstate;
        }
      });
    }
    return card;
    //this._opened = true;
  }

  newCard(state?): string {
    //const card = new CardSchema();
    //card.description = description;
    return (this._addCard(state));
  }
  
}
