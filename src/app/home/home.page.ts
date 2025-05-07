import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {
  @ViewChild("PDFContainer") pdfContainer!: ElementRef<HTMLDivElement>;
  
  documentInstance: any;

  constructor() {

  }

  ngAfterViewInit(): void {      
  }
}
