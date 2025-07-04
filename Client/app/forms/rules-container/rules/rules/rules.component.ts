import { Component, OnInit, Input } from '@angular/core';
import { IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RuleComponent implements OnInit {
  @Input() public dropdownlist: any
  @Input() public model: any
  @Input() public option: any
  constructor() { }
  public uniqueId: string = UUID.UUID();
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'form-control text-left',
    selectionLimit: 1,
    autoUnselect: true,
    closeOnSelect: true,
    containerClasses: 'form-group multiy-select',
  };

  operatorList: any = [
    { name: 'Equal', id: '=' },
    { name: 'Not Equal', id: '<>' },
    { name: 'Greater Than', id: '>' },
    { name: 'Less Than', id: '<' },
    { name: 'In', id: 'in' }
  ]
  //dataoptions: any = [
  //  { name: 'Hide', id: 'hide' },
  //  { name: 'Show', id: 'show' },
  //  { name: 'Enable', id: 'enable' },
  //  { name: 'Disable', id: 'disable' }
  //];
  ngOnInit() {
    if (this.model && !this.model.condition) {
      this.model.condition = 'or';
    }
  }

}
