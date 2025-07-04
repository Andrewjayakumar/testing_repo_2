declare var require;
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
const _ = require('lodash');

@Component({
  selector: 'app-calculator-ui',
  templateUrl: './calculator-ui.component.html',
  styleUrls: ['./calculator-ui.component.scss']
})
export class CalculatorUiComponent implements OnInit {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public formdata: any = {};
  result: string = '';
  Error: string = '';


  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'form-control text-left',
    dynamicTitleMaxItems: 999999999,
    displayAllSelectedText: false,
    containerClasses: 'form-group multiy-select',
    selectionLimit: 1,
    closeOnSelect: true,
    autoUnselect: true,
  };
  myMultiSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'form-control text-left',
    dynamicTitleMaxItems: 999999999,
    displayAllSelectedText: false,
    containerClasses: 'form-group multiy-select',
    selectionLimit: 0,
  };
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };
  selectedValue1 = [];
  selectedValue2 = null;
  selectedFun = ['add'];
  selectedfunId: string = "add";
  mathFunctions: IMultiSelectOption[] = [
    //{ id: 'add', name: 'add(augend, addend)' },
    //{ id: 'subtract', name: 'subtract(minuend, subtrahend)' },
    //{ id: 'multiply', name: 'multiply(multiplier, multiplicand)' },
    //{ id: 'divide', name: 'divide(dividend, divisor)' },
    { id: 'max', name: 'Max(array)' },
    { id: 'mean', name: 'Mean(array)' },
    { id: 'min', name: 'Min(array)' },
    { id: 'sum', name: 'Sum(array)' },
    { id: 'length', name: 'Len(String)' }
    //{ id: 'ceil', name: 'ceil(value)' },
    //{ id: 'floor', name: 'floor(value)' },
    //{ id: 'pow', name: 'pow(value, power)' },
    //{ id: 'sqrt', name: 'sqrt(value)' }
  ]
  //lblvalue1: string = "augend";
  //lblvalue2: string = "addend";
  constructor() { }

  ngOnInit() {
    
    if (this.data[this.control.key].type) {
      this.selectedFun = [];
      this.selectedFun.push(this.data[this.control.key].type);
      this.selectedfunId = this.data[this.control.key].type;
    }
    if (this.data[this.control.key].value1) {
      this.selectedValue1 = [];
      this.selectedValue1.push(this.data[this.control.key].value1);
    }

    this.getModalForGrpCalc();
    this.getModalForGrpArray();
  }
  onFunChange(event: any) {
    
    if (this.selectedFun.length > 0)
      this.selectedfunId = this.selectedFun[0];
    else
      this.selectedfunId = "";

    this.data[this.control.key].type = this.selectedfunId;
    
    this.getModalForGrpCalc();
    this.getModalForGrpArray();
  }
  
  ModalForGrpArray = [];
  getModalForGrpArray() {
    this.ModalForGrpArray = [];
    for (let item in this.formdata) {
      if (Array.isArray(this.formdata[item]))
        this.ModalForGrpArray.push({ id: item, name: item });
    }
  }
  ModalForGrpCalc = [];
  getModalForGrpCalc() {
    this.ModalForGrpCalc = [];
    for (let item in this.formdata) {
      if (!Array.isArray(this.formdata[item]))
        this.ModalForGrpCalc.push({ id: item, name: item });
    }
  }
  getModal() {
    
    var ModalList = [];
    for (let item in this.formdata) {
      //if (!/\D/.test(this.formdata[item]) && !isNaN(parseInt(this.formdata[item])))
      if (Array.isArray(this.formdata[item])) {
        var data = this.formdata[item].length > 0 ? this.formdata[item] : [{}]
        for (let _item in data[0]) {
          if (_item != this.control.key && _item!="id")
            ModalList.push(_item);
        }
      } else if (item != this.control.key && item != "id")
        ModalList.push(item);
    }
    return ModalList;
  }


  append(element: string, type: string = "exp") {
    if (!Array.isArray(this.data[this.control.key])) {
      this.data[this.control.key] = [];
    }
    this.data[this.control.key].push({ type: type, data: element })
  }


  clear() {
    this.data[this.control.key] = [];
    this.Error = '';
  }

  evaluate() {
    try {
      var operation = this.getOpration();
      this.result = eval(operation);
      this.Error = '';
    }
    catch (e) {
      this.Error = 'Cannot evaluate expression!';
    }
  }
  getOpration() {
    var operation = "";
    this.data[this.control.key].forEach(item => {
      if (operation == "") {
        if (item.type == "value") {
          operation = this.formdata[item.data];
        } else {
          operation = item.data;
        }
      } else {
        if (item.type == "value") {
          operation += this.formdata[item.data];
        } else {
          operation += item.data;
        }
      }
    })
    return operation;
  }
  getExpression() {
    var operation = "";
    this.data[this.control.key].forEach(item => {
      if (operation == "") {
        operation = item.data;
      } else {
        operation += item.data;
      }
    })
    return operation;
  }
}
