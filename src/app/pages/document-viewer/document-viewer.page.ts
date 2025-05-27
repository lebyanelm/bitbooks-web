import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentContainerComponent } from 'src/app/components/document-container/document-container.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ViewerControllerComponent } from 'src/app/components/viewer-controller/viewer-controller.component';
import IBackendResponseData from 'src/app/interfaces/IBackendResponse';
import { IDocument } from 'src/app/interfaces/IDocument';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.page.html',
  styleUrls: ['./document-viewer.page.scss'],
  standalone: false
})
export class DocumentViewerPage implements AfterViewInit {
  @ViewChild("ViewerHeader") header!: HeaderComponent;
  @ViewChild("DocumentContainer") documentContainer!: DocumentContainerComponent;
  @ViewChild("ViewerController") viewerController!: ViewerControllerComponent;

  document: IDocument | undefined = undefined;
  
  constructor(private router: ActivatedRoute) {
    this.router.queryParamMap.subscribe((paramsMap) => {
      const docId = paramsMap.get("docId");
      fetch([environment.backend, "document", docId].join("/"))
        .then((response) => {
          response.json().then((json: IBackendResponseData<IDocument | undefined>) => {
            this.document = json.data;
          })
        })
    });
  }

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
