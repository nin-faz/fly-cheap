import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-button-loading',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <button
      mat-raised-button
      [color]="color"
      [class]="buttonClass"
      [disabled]="disabled || (loading$ | async)"
      (click)="onClick()"
      [type]="type"
    >
      @if (loading$ | async) {
        <span class="inline-flex items-center">
          <span
            class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 mr-2"
            [class]="spinnerClass"
          ></span>
          {{ loadingText }}
        </span>
      } @else {
        <span class="inline-flex items-center">
          {{ normalText }}
        </span>
      }
    </button>
  `,
  styles: [],
})
export class ButtonLoadingComponent {
  // State loading
  @Input({ required: true }) loading$!: Observable<boolean>;

  // Texts
  @Input({ required: true }) normalText!: string;
  @Input({ required: true }) loadingText!: string;

  // Styles Materials
  @Input() color = 'primary';
  @Input() buttonClass = 'w-full';
  @Input() spinnerClass = 'border-white';

  // State button
  @Input() disabled = false;
  @Input() type = 'submit';

  // Event
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
