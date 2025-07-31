import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent {
  @Input() label: string = '';
  @Input() iconStart: string = '';
  @Input() iconEnd: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() errorMessages: { [key: string]: string } = {};

  // FormControl is handled via ControlValueAccessor
  @Input() control: FormControl = new FormControl();

  value: string = '';
  isDisabled: boolean = false;

  // ControlValueAccessor interface methods
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  onInput(e: any) {
    const getValue = e.target.value;
    this.value = getValue;
    this.onChange(getValue);
  }

  getErrorMessage(): string | null {
    if (this.control && this.control.errors && this.control.touched) {
      for (const errorKey in this.control.errors) {
        if (this.control.errors.hasOwnProperty(errorKey)) {
          return this.errorMessages[errorKey] || 'Invalid field';
        }
      }
    }
    return null;
  }

  markAsTouched() {
    this.onTouched();
  }
}