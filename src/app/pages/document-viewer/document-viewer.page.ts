import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.page.html',
  styleUrls: ['./document-viewer.page.scss'],
  standalone: false
})
export class DocumentViewerPage implements AfterViewInit {
  @ViewChild("header") header!: HeaderComponent;

  constructor() { }

  ngAfterViewInit() {
    // Setup the height of the document view wrapper
    const navbarWrapper: HTMLDivElement | null = document.querySelector("div.navbar-wrapper"), 
    documentViewWrapper: HTMLDivElement | null = document.querySelector("div.document-view-wrapper");
    if (navbarWrapper && documentViewWrapper) {
      const navbarRects = navbarWrapper.getBoundingClientRect();
      const navbarHeight = navbarRects.height;
      documentViewWrapper.style.height = window.innerHeight-navbarHeight + "px";
    }
  }
}
