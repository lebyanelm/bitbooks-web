import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import WebViewer from "@pdftron/pdfjs-express-viewer";

@Component({
  selector: "app-document-container",
  templateUrl: "./document-container.component.html",
  styleUrls: ["./document-container.component.scss"],
  standalone: false,
})
export class DocumentContainerComponent implements AfterViewInit {
  @ViewChild("DocumentViewWrapper")
  documentViewWrapper!: ElementRef<HTMLDivElement>;
  @Input() documentSrc: string = "/assets/GLS_may_2021.pdf";

  instance!: any;

  // Document information.
  pageNumber: number = 1;
  defaultZoom: number = 1;
  documentName!: string;
  webviewIframe!: Document;
  docViewer!: any;
  document!: any;
  zoomLevel!: number;
  displayMode: any;

  constructor() {}
  ngAfterViewInit() {
    WebViewer(
      {
        path: "../../lib",
        initialDoc: this.documentSrc,
        licenseKey: "M7gQD7R5lp6pzUTnB54Z",
      },
      this.documentViewWrapper.nativeElement,
    ).then((instance: any) => {
      this.instance = instance;
      this.instance.setTheme("dark");

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
          this.injectCustomStyles();
          this.instance.UI.setZoomLevel(this.defaultZoom);

          // Set up the document viewer.
          this.docViewer = this.instance.docViewer;
          this.document = this.docViewer.getDocument();
          this.zoomLevel = this.docViewer.getZoomLevel();
          this.displayMode = this.docViewer
            .getDisplayModeManager()
            .getDisplayMode();

          // Determine page information.
          this.documentName = this.document.filename;
          this.docViewer.enableReadOnlyMode();
          // this.setCurrentPage(this.instance.docViewer.getCurrentPage());

          this.docViewer.addEventListener(
            "pageNumberUpdated",
            (pageNumber: number) => {
              this.pageNumber = pageNumber;
              this.setCurrentPage(this.pageNumber);
            },
          );

          this.docViewer.addEventListener(
            "pageComplete",
            (pageNumber: number) => {
              if (this.pageNumber === pageNumber) {
                this.zoomLevel = this.docViewer.getZoomLevel();
                this.setCurrentPage(this.pageNumber);
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

  async setCurrentPage(num: number) {
    this.pageNumber = num;
    this.clearFakeHighlights();
    await this.getPageText();
    this.toggleFakeHighlight(0);
    setTimeout(() => this.toggleFakeHighlight(1), 5000);
    setTimeout(() => this.toggleFakeHighlight(2), 10000);
  }

  clearFakeHighlights() {
    const fakeHighlights =
      this.webviewIframe.querySelectorAll("div.fake-highlight");
    fakeHighlights.forEach((fakeHighlight) => fakeHighlight.remove());
  }

  async getPageText() {
    const pageText = await this.document.loadPageText(this.pageNumber),
      lines = pageText.split("\n"),
      formattedLines = [];

    let charIdx = 0;
    for (let rowIdx = 0; rowIdx < lines.length; rowIdx++) {
      const startIdx = charIdx,
        lineText = lines[rowIdx],
        endIdx = startIdx + lineText.trim().length;
      if (endIdx > startIdx) {
        const quads = await this.document.getTextPosition(
            this.pageNumber,
            startIdx,
            endIdx,
          ),
          allX = quads.flatMap((q: any) => [q.x1, q.x2, q.x3, q.x4]),
          allY = quads.flatMap((q: any) => [q.y1, q.y2, q.y3, q.y4]),
          minX = Math.min(...allX),
          maxX = Math.max(...allX),
          minY = Math.min(...allY),
          maxY = Math.max(...allY),
          viewerTopLeft = this.document.getViewerCoordinates(
            this.pageNumber,
            minX,
            maxY,
          ),
          viewerBottomRight = this.document.getViewerCoordinates(
            this.pageNumber,
            maxX,
            minY,
          ),
          x = parseFloat(minX.toFixed(2)),
          y = parseFloat(minY.toFixed(2)),
          width = Math.abs(maxX - minX),
          height = Math.abs(maxY - minY),
          coords = { x, y, width, height };
        if (lineText.trim() !== "" || !lineText.includes("____")) {
          this.createFakeHighlight(coords, rowIdx);
        }
      }

      charIdx += lineText.length + 1;
    }
  }

  createFakeHighlight(
    coords: { x: number; y: number; width: number; height: number },
    lineId: number,
    color: string = "orange",
  ) {
    const fakeHighlight = document.createElement("div");
    fakeHighlight.className = `fake-highlight page${this.pageNumber}`;
    fakeHighlight.setAttribute("data-visible", "false");
    fakeHighlight.setAttribute("data-lineId", `${lineId}`);
    fakeHighlight.id = `fh-${lineId}`;
    fakeHighlight.style.left = coords.x * this.zoomLevel + "px";
    fakeHighlight.style.top = coords.y * this.zoomLevel + "px";
    fakeHighlight.style.width = coords.width * this.zoomLevel + "px";
    fakeHighlight.style.height = coords.height * this.zoomLevel + "px";
    fakeHighlight.style.backgroundColor = color;
    const pageContainer = this.webviewIframe.getElementById(
      "pageContainer" + this.pageNumber,
    );
    pageContainer?.appendChild(fakeHighlight);
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
    }
  }

  injectCustomStyles() {
    const link: HTMLLinkElement = document.createElement("link"),
      hostname = location.hostname,
      port = location.port,
      protocol = location.protocol,
      source = "assets/custom-webview-styles.css",
      url = `${protocol}//${hostname}:${port}/${source}`;
    link.rel = "stylesheet";
    link.href = url;
    this.webviewIframe.head.appendChild(link);
  }
}
