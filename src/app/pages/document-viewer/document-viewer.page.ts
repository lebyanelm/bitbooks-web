import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PDFViewerComponent } from 'src/app/components/pdf-viewer/pdf-viewer.component';
import { ViewerControllerComponent } from 'src/app/components/viewer-controller/viewer-controller.component';
import { IDocumentData } from 'src/app/interfaces/IDocumentData';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.page.html',
  styleUrls: ['./document-viewer.page.scss'],
  standalone: false
})
export class DocumentViewerPage implements AfterViewInit {
  @ViewChild("pdfviewer") viewer!: PDFViewerComponent;
  @ViewChild("viewercontrols") viewerControls!: ViewerControllerComponent;

  document: IDocumentData | undefined = undefined;
  
  constructor() {
  }

  ngAfterViewInit() {
    // Setup the height of the document view wrapper
    const viewControllerElement: HTMLDivElement | null = document.querySelector("div.viewer-controller-container"), 
          viewerElement: HTMLDivElement | null = document.querySelector("div.pdf-container");
    if (viewControllerElement && viewerElement) {
      const controllerRect = viewControllerElement.getBoundingClientRect();
      const controllerHeight = controllerRect.height;
      viewerElement.style.setProperty("--controller-height", `${controllerHeight}px`);
    }
  }
}
