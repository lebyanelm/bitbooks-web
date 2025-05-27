import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IDocument } from '../interfaces/IDocument';
import { environment } from 'src/environments/environment';
import IBackendResponseData from '../interfaces/IBackendResponse';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {
  @ViewChild("PDFContainer") pdfContainer!: ElementRef<HTMLDivElement>;
  
  documentInstance: any;
  documents: IDocument[] | undefined = []

  constructor() {
    fetch([environment.backend, "documents"].join("/"))
      .then((response) => {
        response.json().then((json: IBackendResponseData<IDocument[]>) => {
          this.documents = json.data;
        })
      })
  }

  ngAfterViewInit(): void {      
  }
}
