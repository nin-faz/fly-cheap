import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
  standalone: true,
})
export class PricePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (!value) return '0€';
    return `${value.toLocaleString('fr-FR')}€`;
  }
}
