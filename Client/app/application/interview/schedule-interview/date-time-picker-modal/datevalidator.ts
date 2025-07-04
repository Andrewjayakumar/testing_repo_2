import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function DateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const controlDate = new Date(control.value);
    controlDate.setHours(0, 0, 0, 0);
   
    if (controlDate.getTime() < currentDate.getTime()) {
      return { 'pastdate': true };
    }
    return null;
  };
}
