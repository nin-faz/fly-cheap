import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <div class="h-[30.5em] bg-red-500"></div>
    <app-footer></app-footer>
  `,
  styleUrls: [],
})
export class App {
  protected readonly title = signal('fly-cheap');
}
