declare var require;
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
const _ = require('lodash');

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit, OnChanges {
  @Input() public data: any = [];
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public formdata: any = {};

  ModalList: any = []
  dataoptions: any = [
    { name: 'Hide', id: 'hide' },
    { name: 'Show', id: 'show' },
    { name: 'Enable', id: 'enable' },
    { name: 'Disable', id: 'disable' }
  ];
  action: string = 'hide';
  constructor() {
  }

  ngOnInit() {
    this.setActionType();
  }
  ngOnChanges(control: any) {
    this.getModal();
  }
  setActionType() {
    this.action = Array.isArray(this.data[this.control.key]) && this.data[this.control.key].length > 0 ? this.data[this.control.key][0].action : 'hide';
  }
  AddRule() {
    if (Array.isArray(this.data[this.control.key])) {
      this.data[this.control.key].push({ control: "", operator: "", value: "", action: this.action });
    } else {
      this.data[this.control.key] = [];
      this.data[this.control.key].push({ control: "", operator: "", value: "", action: this.action });
    }
  }
  onActionChange() {
    if (Array.isArray(this.data[this.control.key])) {
      this.data[this.control.key].forEach(rule => {
        rule.action = this.action;
      })
    }
  }
  removeRule(data) {
    _.remove(this.data[this.control.key], function (rule) {
      return rule === data;
    });
  }
  getModal() {
    
    this.ModalList = [];
    var arr: any = {};
    for (let item in this.formdata) {
      if (Array.isArray(this.formdata[item])) {
        var data = this.formdata[item].length > 0 ? this.formdata[item] : [{}]
        for (let _item in data[0]) {
          if (_item != this.control.key) {
            arr = {};
            arr.name = _item;
            arr.id = _item;
            this.ModalList.push(arr);
          }
        }
      } else if (item != this.control.key) {
        arr = {};
        arr.name = item;
        arr.id = item;
        this.ModalList.push(arr);
      }
    }
  }
}
