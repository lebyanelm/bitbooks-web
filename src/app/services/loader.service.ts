import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading = new Subject<boolean>();
  constructor() { }
  showLoader() {
    this.setState(true);
  }
  hideLoader() {
    this.setState(false);
  }
  setState(state: boolean) {
    this.isLoading.next(state);
  }
}
