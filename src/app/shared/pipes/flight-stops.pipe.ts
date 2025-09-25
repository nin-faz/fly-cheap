import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flightStops',
  standalone: true,
})
export class FlightStops implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';
    if (value === 0) return 'Vol direct';
    return `${value} escale${value > 1 ? 's' : ''}`;
  }
}
