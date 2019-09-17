import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'get-bikecounter'
})
export class GetBikecounterPipe implements PipeTransform {

  transform(value: string): string {
    return value.split('|')[0];
  }

}
