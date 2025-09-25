import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StatusHighlightDirective } from './status-highlight.directive';

// Composant de test pour tester la directive
@Component({
  template: '<div [appStatusHighlight]="status" data-testid="status-element">Test</div>',
  standalone: true,
  imports: [StatusHighlightDirective],
})
class TestComponent {
  status: 'confirmed' | 'cancelled' = 'confirmed';
}

describe('StatusHighlightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let statusElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, StatusHighlightDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    statusElement = fixture.debugElement.query(By.css('[data-testid="status-element"]'));
  });

  it('should create', () => {
    expect(statusElement).toBeTruthy();
  });

  describe('when status is "confirmed"', () => {
    beforeEach(() => {
      component.status = 'confirmed';
      fixture.detectChanges();
    });

    it('should add confirmed status classes', () => {
      const element = statusElement.nativeElement;

      expect(element.classList.contains('bg-emerald-100')).toBe(true);
      expect(element.classList.contains('text-emerald-800')).toBe(true);
    });

    it('should not have cancelled status classes', () => {
      const element = statusElement.nativeElement;

      expect(element.classList.contains('bg-red-100')).toBe(false);
      expect(element.classList.contains('text-red-800')).toBe(false);
    });

    it('should set text content to "Confirmé"', () => {
      const element = statusElement.nativeElement;
      expect(element.textContent).toBe('Confirmé');
    });

    it('should have common styling classes', () => {
      const element = statusElement.nativeElement;

      expect(element.classList.contains('px-2')).toBe(true);
      expect(element.classList.contains('py-1')).toBe(true);
      expect(element.classList.contains('rounded-full')).toBe(true);
      expect(element.classList.contains('text-xs')).toBe(true);
      expect(element.classList.contains('font-semibold')).toBe(true);
      expect(element.classList.contains('transition-all')).toBe(true);
      expect(element.classList.contains('duration-300')).toBe(true);
    });
  });

  describe('when status is "cancelled"', () => {
    beforeEach(() => {
      component.status = 'cancelled';
      fixture.detectChanges();
    });

    it('should add cancelled status classes', () => {
      const element = statusElement.nativeElement;

      expect(element.classList.contains('bg-red-100')).toBe(true);
      expect(element.classList.contains('text-red-800')).toBe(true);
    });

    it('should not have confirmed status classes', () => {
      const element = statusElement.nativeElement;

      expect(element.classList.contains('bg-emerald-100')).toBe(false);
      expect(element.classList.contains('text-emerald-800')).toBe(false);
    });

    it('should set text content to "Annulé"', () => {
      const element = statusElement.nativeElement;
      expect(element.textContent).toBe('Annulé');
    });

    it('should have common styling classes', () => {
      const element = statusElement.nativeElement;

      expect(element.classList.contains('px-2')).toBe(true);
      expect(element.classList.contains('py-1')).toBe(true);
      expect(element.classList.contains('rounded-full')).toBe(true);
      expect(element.classList.contains('text-xs')).toBe(true);
      expect(element.classList.contains('font-semibold')).toBe(true);
      expect(element.classList.contains('transition-all')).toBe(true);
      expect(element.classList.contains('duration-300')).toBe(true);
    });
  });

  describe('when status changes', () => {
    it('should update classes when changing from confirmed to cancelled', () => {
      // Initial state: confirmed
      component.status = 'confirmed';
      fixture.detectChanges();

      const element = statusElement.nativeElement;
      expect(element.classList.contains('bg-emerald-100')).toBe(true);
      expect(element.classList.contains('text-emerald-800')).toBe(true);
      expect(element.textContent).toBe('Confirmé');

      // Change to cancelled
      component.status = 'cancelled';
      fixture.detectChanges();

      expect(element.classList.contains('bg-emerald-100')).toBe(false);
      expect(element.classList.contains('text-emerald-800')).toBe(false);
      expect(element.classList.contains('bg-red-100')).toBe(true);
      expect(element.classList.contains('text-red-800')).toBe(true);
      expect(element.textContent).toBe('Annulé');
    });

    it('should update classes when changing from cancelled to confirmed', () => {
      // Initial state: cancelled
      component.status = 'cancelled';
      fixture.detectChanges();

      const element = statusElement.nativeElement;
      expect(element.classList.contains('bg-red-100')).toBe(true);
      expect(element.classList.contains('text-red-800')).toBe(true);
      expect(element.textContent).toBe('Annulé');

      // Change to confirmed
      component.status = 'confirmed';
      fixture.detectChanges();

      expect(element.classList.contains('bg-red-100')).toBe(false);
      expect(element.classList.contains('text-red-800')).toBe(false);
      expect(element.classList.contains('bg-emerald-100')).toBe(true);
      expect(element.classList.contains('text-emerald-800')).toBe(true);
      expect(element.textContent).toBe('Confirmé');
    });
  });

  describe('common styling classes', () => {
    it('should always have common classes regardless of status', () => {
      const commonClasses = [
        'px-2',
        'py-1',
        'rounded-full',
        'text-xs',
        'font-semibold',
        'transition-all',
        'duration-300',
      ];

      // Test with confirmed status
      component.status = 'confirmed';
      fixture.detectChanges();

      let element = statusElement.nativeElement;
      commonClasses.forEach((className) => {
        expect(element.classList.contains(className)).toBe(true);
      });

      // Test with cancelled status
      component.status = 'cancelled';
      fixture.detectChanges();

      element = statusElement.nativeElement;
      commonClasses.forEach((className) => {
        expect(element.classList.contains(className)).toBe(true);
      });
    });
  });
});
