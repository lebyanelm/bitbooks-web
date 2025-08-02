import { Component, HostListener } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  isShowLoader = false;
  
  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading.subscribe((state) => this.isShowLoader = state);
  }
}
