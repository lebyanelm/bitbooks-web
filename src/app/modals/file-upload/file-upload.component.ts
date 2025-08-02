import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IDocumentData } from 'src/app/interfaces/IDocumentData';
import { IUploadProgress } from 'src/app/interfaces/IUploadProgress';
import { DocumentService } from 'src/app/services/document.service';
import { environment } from 'src/environments/environment';
import * as superagent from "superagent";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  standalone: false
})
export class FileUploadComponent  implements OnInit {
  @Input() destinationFolder!: string;
  fileInput: HTMLInputElement = document.createElement("input");
  isDisabled = true;
  isProcessingFile = false;
  currentProgress: IUploadProgress | undefined = undefined;
  
  constructor(
      private modalCtrl: ModalController,
      private docService: DocumentService) {
    this.fileInput.type = "file";
    this.fileInput.multiple = false;
    this.fileInput.accept = "application/pdf";

    this.fileInput.onchange = () => {
      if (this.fileInput.files && this.fileInput.files.length) {
        this.isProcessingFile = true;
        this.docService.createDocument(this.fileInput.files[0], this.destinationFolder ? this.destinationFolder : "default")
          .then((docId) => {
            let retryCount = 0;
            const pollId = setInterval(() => {
              this.pollUploadStatus(docId);

              if (!this.currentProgress) {
                retryCount += 1;
              }

              if (retryCount > 20) {
                clearInterval(pollId);
                alert("Document upload timeout error.");
              }

              if (this.currentProgress) {
                if (this.currentProgress.current_progress === this.currentProgress.total_progress) {
                  this.modalCtrl.dismiss({ docId })
                  clearInterval(pollId);
                }
              }
            }, 1000)
          })
      }
    }
  }
  ngOnInit() {
    this.isDisabled = false;
  }

  browseFiles() {
    if (!this.isDisabled) {
      this.fileInput.click();
    }
  }

  pollUploadStatus(docId: string) {
    return new Promise((resolve, reject) => {
      superagent
        .get([environment.backend, "uploads", "status", docId].join("/"))
        .end((_, response) => {
          if (response && response.statusCode === 200) {
            this.currentProgress = response.body.data;
            if (this.currentProgress) {
              this.currentProgress.percentage = ((this.currentProgress.current_progress/this.currentProgress.total_progress)*100)
                                  .toFixed(2) + "%";
            }
          }
        })
    });
  }
}
