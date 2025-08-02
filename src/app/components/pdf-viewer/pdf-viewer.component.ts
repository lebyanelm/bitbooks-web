import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IDocumentData } from "src/app/interfaces/IDocumentData";
import { IPageReadRep } from "src/app/interfaces/IPageReadAnnotations";
import { AudioService } from "src/app/services/audio.service";
import { DocumentService } from "src/app/services/document.service";
import { LoaderService } from "src/app/services/loader.service";
import { EventBus } from 'pdfjs-dist/web/pdf_viewer.mjs';
import * as PDFJS from 'pdfjs-dist';
import * as PDFJSViewer from "pdfjs-dist/web/pdf_viewer.mjs";

declare const pdfjsLib: typeof PDFJS;
declare const pdfjsViewer: typeof PDFJSViewer;

@Component({
  selector: "app-pdf-viewer",
  templateUrl: "./pdf-viewer.component.html",
  styleUrls: ["./pdf-viewer.component.scss"],
  standalone: false,
})
export class PDFViewerComponent implements AfterViewInit {
  @ViewChild("PDFContainer", { static: true }) pdfContainer!: ElementRef<HTMLDivElement>;
  @ViewChild("PDFViewer", { static: true }) pdfViewer!: ElementRef<HTMLDivElement>;
  
  docData!: IDocumentData | undefined;
  doc!: any | undefined;

  // Page rendering
  eventBus: EventBus = new EventBus()
  viewer!: any; 
  scaleFactor = .8;
  currentSentenceId: string | null = null;
  isScrollSync = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private docService: DocumentService,
    private loaderService: LoaderService,
    private audioService: AudioService,
  ) {
    this.loaderService.showLoader();
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const docId = queryParams["docId"];
      if (docId) {
        this.docService.getDocument(docId)
          .then((document) => {
            this.docData = document;
          });
      }

      this.audioService.eventBus.on("newsource", (next: any) => {
        if (this.currentSentenceId) this.removeReadAnnotationState(this.currentSentenceId, "reader");
        let [ _, sentenceId ] = next;
        sentenceId = "annot-" + sentenceId;
        this.currentSentenceId = sentenceId;
        this.setReadAnnotationState(this.currentSentenceId as any, "reader");
      })
      this.audioService.onnext.subscribe();
    });
  }

  async ngAfterViewInit() {
    const awaiterId = setInterval(() => {
      if (this.docData) {
        clearInterval(awaiterId);
        this.loadPdfDocument();
      }
    }, 100);
  }

  async loadPdfDocument() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.mjs";
    this.viewer = new pdfjsViewer.PDFViewer({
      container: this.pdfContainer.nativeElement,
      eventBus: this.eventBus,
      textLayerMode: 0,
      annotationEditorMode: pdfjsLib.AnnotationEditorType.NONE
    });
    // Load the document that has been opened.
    this.doc = await pdfjsLib.getDocument(this.docData?.document_source).promise;
    this.audioService.setTotalPages(this.doc.numPages);
    this.viewer.setDocument(this.doc);

    // Set the initial page size.
    this.viewer.currentScaleValue = "page-width";

    // Start listeneing to the viewer events necessary for further initiation.
    this.initialiseEventListeners();

    // Hide the loader as data has been succesfully fetched.
    this.loaderService.hideLoader();
  }

  initialiseEventListeners() {
    // Everytime a page has been rendered, allows lazyloading of page data.
    this.eventBus.on("pagerendered", this.onPageRendered.bind(this));
  }

  onPageRendered(event: any) {
    /*
    Creates a text layer of the rendered page.
    */
    const pageNumber = event.pageNumber,
      pageElement: HTMLDivElement = event.source.div,
      textLayer = document.createElement("div");
    textLayer.className = "custom-text-layer";
    textLayer.style.height = `100%`;
    textLayer.style.width = `100%`;
    textLayer.style.position = "absolute";
    textLayer.style.top = "0";
    textLayer.style.left = "0";

    const scaleFactor = (document.querySelector(".pdfViewer") as HTMLDivElement)
                            ?.style?.getPropertyValue("--scale-factor");
    this.renderPageTextLayer(pageNumber, textLayer, parseFloat(scaleFactor));
    pageElement.appendChild(textLayer);
  }

  async renderPageTextLayer(pageNumber: number, textLayer: HTMLDivElement, scaleFactor: number) {
    scaleFactor -= .025;
    if (!this.docData) return;

    try {
      const pageReadAnnotations: IPageReadRep = await this.docService.getPageReadAnnotations(
        this.docData.id, 
        pageNumber
      );

      if (!pageReadAnnotations?.sentences) return;
      this.audioService.addPageAnnotations(pageReadAnnotations);

      textLayer.innerHTML = ''; // Clear previous annotations

      pageReadAnnotations.sentences.forEach((sentence) => {
        sentence.read_annotations.forEach((annot) => {
          const readAnnot = document.createElement("div");
          const annotId = `annot-${sentence.id}`;
          
          readAnnot.className = "custom-annotation";
          readAnnot.id = annotId;

          const sizeOffset = 1;
          readAnnot.style.width = `${(annot.w + sizeOffset) * scaleFactor}px`;
          readAnnot.style.height = `${(annot.h + sizeOffset) * scaleFactor}px`;
          readAnnot.style.top = `${(annot.y - (sizeOffset/2)) * scaleFactor}px`;
          readAnnot.style.left = `${(annot.x - (sizeOffset/2)) * scaleFactor}px`;
          readAnnot.setAttribute("title", "Double click to save this to notes.")
          
          readAnnot.onmouseenter = () => {
            this.setReadAnnotationState(annotId, "hover");
          };
          
          readAnnot.onmouseleave = () => {
            this.removeReadAnnotationState(annotId, "hover");
          };

          readAnnot.ondblclick = () => {
            this.audioService.startReaderFrom(pageNumber, sentence.id);
          };
          
          textLayer.appendChild(readAnnot);
        });
      });
    } catch (error) {
      console.error(`Error rendering text layer for page ${pageNumber}:`, error);
    }
  }

  setReadAnnotationState(annotId: string, state: "reader" | "noted" | "hover" | "normal") {
    const annotations = document.querySelectorAll(`#${annotId}`);
    annotations.forEach((annotation, index) => {
      if (state === "reader" && index === 0) {
        if (this.isScrollSync) {
          annotation.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      annotation.classList.add(state);
    });
  }

  removeReadAnnotationState(annotId: string, state:  "reader" | "noted" | "hover" | "normal") {
    const annotations = document.querySelectorAll(`#${annotId}`);
    annotations.forEach((annotation) => {
      annotation.classList.remove(state);
    });
  }
}