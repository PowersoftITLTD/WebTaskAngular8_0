import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isArray'
})
export class isArrayPipe implements PipeTransform {

  transform(value: any): boolean {
    return Array.isArray(value);
  }
}


@Pipe({
  name: 'isObject'
})
export class IsOBjectPipe implements PipeTransform {
  transform(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}