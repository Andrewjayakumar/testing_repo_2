import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minSkillsValidator(minSkillsCount: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const primarySkills = control.value;
  
      console.log("control.value", primarySkills); // Logs the value of the control
  
      if (!primarySkills) {
        // If there's no value for primarySkills, return validation error
        console.log("No skills found.");
        return { minSkills: true };
      }
  
      if (Array.isArray(primarySkills)) {
        if (primarySkills.length < minSkillsCount) {
          console.log(`Not enough skills: required ${minSkillsCount}, but got ${primarySkills.length}`);
          return { minSkills: true }; 
        }
      } else {
        console.log("primarySkills is not an array");
        return { minSkills: true }; // If it's not an array, return error
      }
  
      return null;
    };
  }
  