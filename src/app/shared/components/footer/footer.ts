import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer
      class="w-full bg-blue-200 text-[#005cbb] p-6 flex flex-col  md:flex-row items-center justify-between shadow-inner"
    >
      <div class="flex items-center gap-2">
        <span class="font-bold text-lg">FlyCheap</span>
        <span class="text-sm">&copy; 2025</span>
      </div>
      <div class="flex gap-6 mt-3 md:mt-0">
        <a href="#" class="hover:text-blue-300 transition">Mentions légales</a>
        <a href="#" class="hover:text-blue-300 transition">Contact</a>
        <a href="#" class="hover:text-blue-300 transition">Instagram</a>
        <a href="#" class="hover:text-blue-300 transition">Twitter</a>
      </div>
    </footer>
  `,
  styles: '',
})
export class FooterComponent {}
