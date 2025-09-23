import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appStatusHighlight]',
  standalone: true,
})
export class StatusHighlightDirective implements OnChanges {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input('appStatusHighlight') status!: 'confirmed' | 'cancelled';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      this.updateStatusDisplay();
    }
  }

  private updateStatusDisplay(): void {
    // Nettoyer les classes existantes
    this.renderer.removeClass(this.el.nativeElement, 'bg-emerald-100');
    this.renderer.removeClass(this.el.nativeElement, 'text-emerald-800');
    this.renderer.removeClass(this.el.nativeElement, 'bg-red-100');
    this.renderer.removeClass(this.el.nativeElement, 'text-red-800');

    // Appliquer les nouvelles classes selon le statut
    switch (this.status) {
      case 'confirmed':
        this.renderer.addClass(this.el.nativeElement, 'bg-emerald-100');
        this.renderer.addClass(this.el.nativeElement, 'text-emerald-800');
        this.renderer.setProperty(this.el.nativeElement, 'textContent', 'Confirmé');
        break;

      case 'cancelled':
        this.renderer.addClass(this.el.nativeElement, 'bg-red-100');
        this.renderer.addClass(this.el.nativeElement, 'text-red-800');
        this.renderer.setProperty(this.el.nativeElement, 'textContent', 'Annulé');
        break;
    }

    // Ajouter classes communes
    this.renderer.addClass(this.el.nativeElement, 'px-2');
    this.renderer.addClass(this.el.nativeElement, 'py-1');
    this.renderer.addClass(this.el.nativeElement, 'rounded-full');
    this.renderer.addClass(this.el.nativeElement, 'text-xs');
    this.renderer.addClass(this.el.nativeElement, 'font-semibold');
    this.renderer.addClass(this.el.nativeElement, 'transition-all');
    this.renderer.addClass(this.el.nativeElement, 'duration-300');
  }
}
