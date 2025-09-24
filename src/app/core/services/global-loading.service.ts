import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoadingService {
  private readonly globalLoadingSubject = new BehaviorSubject<boolean>(false);

  globalLoading$ = this.globalLoadingSubject.asObservable();

  show(): void {
    this.globalLoadingSubject.next(true);
  }

  hide(): void {
    this.globalLoadingSubject.next(false);
  }

  get isLoading(): boolean {
    return this.globalLoadingSubject.value;
  }
}
