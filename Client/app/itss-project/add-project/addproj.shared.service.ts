import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { AddprojFormData } from '../add-project/model/AddprojFormData';

@Injectable()
export class AddProjSharedService {

  private updateDetails: AddprojFormData;

  public nextClicked = new Subject();
  nextClick$ = this.nextClicked.asObservable();

  public backClicked = new BehaviorSubject(false);
  backBtnClick$ = this.backClicked.asObservable();

  constructor() {
    this.updateDetails = new AddprojFormData();
  }

  // private formData: RecFormData = new RecFormData();
  private isRecDetailFormValid: boolean = false;
  private isClientFormValid: boolean = false;

  public createButtonClicked: boolean = false;


  resetFormData() {

    this.isRecDetailFormValid = this.isClientFormValid = false;

  }

  /** validateRecDetailFormValid(isValid) {
     
     }
 
     validateRecDateForm() {
 
     }
     **/
  setFormData(details: any) {
    let keys = Object.keys(details);
    keys.forEach(param => {
      this.updateDetails[param] = details[param];
    });
  }

  getFormData() {
    return this.updateDetails;
  }
}
