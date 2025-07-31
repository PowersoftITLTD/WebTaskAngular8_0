import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortName',
})
export class ShortNamePipe implements PipeTransform {
  transform(fullName: string, numChars: number = 2): any {
    return fullName
      // .split(' ')
      // .slice(0, numChars)
      // .map((n) => n[0].toUpperCase())
      // .join('');
  }
}
