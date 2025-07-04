import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function OneMonthPastDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const pastOneMonthDate = new Date(currentDate);
    pastOneMonthDate.setMonth(currentDate.getMonth() - 1);
    
    
    const controlDate = new Date(control.value);
    controlDate.setHours(0, 0, 0, 0);
   
    if (controlDate.getTime() < pastOneMonthDate.getTime()) {
      return { 'pastdate': true };
    }
    return null;
  };
}
