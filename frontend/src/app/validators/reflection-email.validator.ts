import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function ReflectionEmailValidator(): ValidatorFn {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const isEmail = emailRegex.test(control.value);
    return isEmail ? null : {"email": {value: control.value}};
  };
}
