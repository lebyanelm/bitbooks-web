import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import WebViewer from "@pdftron/pdfjs-express-viewer";
import { IDocument } from "src/app/interfaces/IDocument";
import IPageInfo from "src/app/interfaces/IPageInfo";
import IText from "src/app/interfaces/ITexts";
import { TranscriptionService } from "src/app/services/transcription.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-document-container",
  templateUrl: "./document-container.component.html",
  styleUrls: ["./document-container.component.scss"],
  standalone: false,
})
export class DocumentContainerComponent implements AfterViewInit {
  @ViewChild("DocumentViewWrapper") documentViewWrapper!: ElementRef<HTMLDivElement>;

  @Input() docRef!: IDocument | undefined;

  instance!: any;

  // Document information.
  pageNumber: number = 1;
  defaultZoom: number = 1;
  documentName!: string;
  webviewIframe!: Document;
  docViewer!: any;
  annotations: any = [];
  lastLoadedPage = 0;
  currentHighlightId!: null | number;

  // Parameters
  zoomLevel!: number;
  displayMode: any;
  readSpeed: number = 1;
  readPitch: number = 0;

  constructor(private transcriptionService: TranscriptionService) {}
  ngAfterViewInit() {
    this.showDocumentLoader(true);
    const documentChecker = setInterval(() => {
      if (this.docRef) {
        this.showDocument();
        this.lazyLoadPageAnnotations();
        clearInterval(documentChecker);
      }
    }, 500);
  }

  showDocument() {
    WebViewer(
      {
        path: "../../lib",
        initialDoc: this.docRef?.document_source,
        licenseKey: "M7gQD7R5lp6pzUTnB54Z",
      },
      this.documentViewWrapper.nativeElement,
    ).then((instance: any) => {
      this.instance = instance;
      const { Annotations, annotManager, docViewer } = this.instance;
      const customAnnot =


      // Customize the UI of the PDF viewer.
      this.instance.setTheme("dark");
      this.instance.UI.disableFeatures([
        this.instance.UI.Feature.ContextMenu
      ]);
      this.instance.UI.disableElements([
        "contextmenu"
      ]);

      // Initialize the initial page.
      this.instance.Core.documentViewer.addEventListener(
        "documentLoaded",
        () => {
          // Determine the rendering iframe.
          const webviewIframe: any = document.getElementById("webviewer-1");
          this.webviewIframe =
            webviewIframe.contentDocument ||
            webviewIframe.contentWindow?.document;

          // To be able to customize the UI.
          this.instance.UI.setZoomLevel(this.defaultZoom);

          // Set up the document viewer.
          this.docViewer = this.instance.docViewer;

          this.zoomLevel = this.docViewer.getZoomLevel();
          this.displayMode = this.docViewer
            .getDisplayModeManager()
            .getDisplayMode();
          const pageIndex = this.pageNumber-1;
          const pageCoords = {x:100,y:200}
          const viewCoords = this.displayMode.pageToWindow(this.pageNumber, {...pageCoords,pageIndex});
          console.log("Viewer coords:", viewCoords);

          // Determine page information.
          this.docViewer.enableReadOnlyMode();
          this.docViewer.addEventListener(
            "pageNumberUpdated",
            (pageNumber: number) => {
              this.pageNumber = pageNumber;
              this.updatePages();
            },
          );

          this.docViewer.addEventListener(
            "pageComplete",
            (pageNumber: number) => {
              if (this.pageNumber === pageNumber) {
                this.zoomLevel = this.docViewer.getZoomLevel();
                this.updatePages();
              }
            },
          );

          this.docViewer.addEventListener("zoomLevelUpdated", (event: any) => {
            alert("zoomed");
          });
        },
      );
    });
  }

  showDocumentLoader(state = true) {
    this.documentViewWrapper.nativeElement.setAttribute("data-loader", state.toString());
  }

  lazyLoadPageAnnotations(lazyLoadCount = 10) {
    let pageStart = this.pageNumber,
      pageEnd = this.pageNumber+10;
    console.log(pageEnd, this.lastLoadedPage)
    if (this.lastLoadedPage < pageEnd) {
      if (pageStart < 0) pageStart = 1
      console.log(pageStart, pageEnd)
      fetch([environment.backend,
        "document", this.docRef?.id,
        "annotations", `${pageStart}-${pageEnd}`].join("/")).then((response) => {
          response.json().then((json: any) => {
            this.annotations = json.data;
            this.lastLoadedPage += this.annotations.length;
            this.showDocumentLoader(false);
            const docViewerChecker = setInterval(() => {
              if (this.docViewer) {
                this.renderAnnotations();
                clearInterval(docViewerChecker);
              }
            }, 500);
          });
        });
    } else {
      console.log("Annotations already loaded.")
    }
  }

  renderAnnotations() {
    console.log("Rendering annotations...", this.annotations.length)
    const page = 1;
    const x = 100;
    const y = 200;
    const width = 150;
    const height = 50;
    const customAnnot = new this.instance.Annotations.RectangleAnnotation()
    console.log(customAnnot)
    // this.annotations.forEach((page: any) => {
    //   page.sentences.forEach((sentence: any) => {
    //     sentence.read_annotations.forEach((annotation: any, index: number) => {
    //       // const annotation =
    //     //   this.createAnnotation(page.page_number,
    //     //     {
    //     //       x: annotation.x,
    //     //       y: annotation.y,
    //     //       width: annotation.w,
    //     //       height: annotation.h},
    //     //     sentence.id+index)
    //     });
    //   });
    // });
  }

  async updatePages(num = undefined) {
    const pageNumber = num || this.pageNumber;
    // Check if we can lazy load page data
    if (pageNumber%5 === 0) {
      this.lazyLoadPageAnnotations();
    }
    this.renderAnnotations();
    // Convert these texts into audio format for the reader
    // this.transcriptionService.startTranscription(texts, pageInfo)
    //   .then((transcription) => {
    //     this.transcriptionService.startReader(this.onReaderHighlightUpdate.bind(this))
    //   }).catch((error) => {
    //     console.log(error);
    //   })
  }

  onReaderHighlightUpdate(hId: number): void {
    this.currentHighlightId = hId;
    this.toggleFakeHighlight(hId);
  }

  clearFakeHighlights() {
    const fakeHighlights =
      this.webviewIframe.querySelectorAll("div.fake-highlight");
    fakeHighlights.forEach((fakeHighlight) => fakeHighlight.remove());
  }

  createAnnotation(
    pageNumber: number,
    coords: { x: number; y: number; width: number; height: number },
    annotId: string,
    color: string = "tomato",
  ) {
    const annotation = document.createElement("div");
    annotation.className = `annotation page${pageNumber}`;
    annotation.setAttribute("data-visible", "false");
    annotation.setAttribute("data-top", `${coords.y}`)
    annotation.style.border = "2px solid red";
    annotation.id = `annotation-${annotId}`;
    annotation.style.left = coords.x * this.zoomLevel + "px";
    annotation.style.top = coords.y * this.zoomLevel + "px";
    annotation.style.width = (coords.width + 6) * this.zoomLevel + "px";
    annotation.style.height = coords.height * this.zoomLevel + "px";
    annotation.style.backgroundColor = color;
    const pageContainer = this.webviewIframe.getElementById(
      "pageContainer" + pageNumber,
    );
    pageContainer?.prepend(annotation);
  }

  toggleFakeHighlight(highlightId: number | string) {
    const highlight = this.webviewIframe.querySelector(`#fh-${highlightId}`);
    if (highlight) {
      const currentToggledHighlight = this.webviewIframe.querySelector(
        `.fake-highlight[data-visible="true"]`,
      );

      // Remove the previous active highlight.
      if (currentToggledHighlight) {
        currentToggledHighlight.setAttribute("data-visible", "false");
      }

      // Show the new highlight.
      highlight.setAttribute("data-visible", "true");

      // Scroll to the element if its out of sight
      const scrollHeight = highlight.getAttribute("data-top"),
          scrollElement = this.docViewer.getScrollViewElement();
      if (scrollHeight) {
        scrollElement.scrollTo({
          top: parseInt(scrollHeight),
          left: 0,
          behaviour: "smooth"
        });
      }
    }
  }
}
