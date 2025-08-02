// Declare the global PDF.js variable
import * as PDFJS from 'pdfjs-dist';
import * as PDFJSViewer from "pdfjs-dist/web/pdf_viewer.mjs";

declare global {
  interface Window {
    pdfjsLib: typeof PDFJS;
    pdfjsViewer: typeof PDFJSViewer;
  }
  const pdfjsLib: typeof PDFJS;
  const pdfjsViewer: typeof PDFJSViewer;
}