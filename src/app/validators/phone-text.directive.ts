import { Directive, forwardRef, Inject, Injectable, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, NG_VALIDATORS, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';


// export function phoneTextValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const value = control.value as string;

//     if (!value) {
//       return null; // No hay error si el campo está vacío
//     }

//     const regex = /^\d{9}(,\d{9})*$/;

//     const valueWithoutSpaces = value.replace(/\s/g, '');

//     if (!regex.test(valueWithoutSpaces)) {
//       return { phoneText: true }; // Devuelve un error si no cumple
//     }

//     return null; // No hay error
//   };
// }

//pasarlo a aysncrono

@Injectable({ providedIn: 'root' })
export class PhoneTextValidator implements AsyncValidator {
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable<ValidationErrors | null>(observer => {
      const value = control.value as string;

      if (!value) {
        observer.next(null); // No hay error si el campo está vacío
        observer.complete();
      }

      const regex = /^\d{9}(,\d{9})*$/;

      const valueWithoutSpaces = value.replace(/\s/g, '');

      if (!regex.test(valueWithoutSpaces)) {
        observer.next({ phoneText: true }); // Devuelve un error si no cumple
        observer.complete();
      }

      observer.next(null); // No hay error
      observer.complete();
    });
  }
}


@Directive({
  selector: '[appPhoneText]',
  standalone: false,
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => PhoneTextDirective),
    multi: true
  }]
})
export class PhoneTextDirective implements AsyncValidator {

  constructor(private validator: PhoneTextValidator) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.validator.validate(control);
  }
}
