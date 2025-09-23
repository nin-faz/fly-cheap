import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
  pure: true, // Pure pipe for better performance
})
export class DurationPipe implements PipeTransform {
  // Parse duration string ("2h 45m") and convert to total minutes
  transform(duration: string): number {
    const regex = /(\d+)h\s*(\d+)?m?/;

    const match = regex.exec(duration);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return hours * 60 + minutes;
    }
    return 0;
  }
}
