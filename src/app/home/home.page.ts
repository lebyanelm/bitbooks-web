import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IDocumentData } from '../interfaces/IDocumentData';
import { RouterService } from '../services/router.service';
import { DocumentService } from '../services/document.service';
import { ModalController } from '@ionic/angular';
import { FileUploadComponent } from '../modals/file-upload/file-upload.component';
import { IFolder } from '../interfaces/IFolder';
import { LoaderService } from '../services/loader.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  @ViewChild("PDFContainer") pdfContainer!: ElementRef<HTMLDivElement>;
  
  documentInstance: any;
  documents: IDocumentData[] | undefined = []
  folders: IFolder[] | undefined = []
  current_folder_id: string | undefined = undefined
  current_folder: IFolder | undefined = undefined;

  // Folder creation
  isCreateFolder = false;
  folderName: string | undefined = undefined;
  
  constructor(public router: RouterService,
              private docService: DocumentService,
              private modalCtrl: ModalController,
              private loader: LoaderService,
              private activateRoute: ActivatedRoute)
  {
    this.loader.showLoader();
    this.activateRoute.params.subscribe((params) => {
      this.current_folder_id = params["folder_name"]
      if (this.current_folder_id === "default") {
        this.docService.getFolders()
          .then((folders) => {
            this.folders = folders;
            this.docService.getDocuments()
              .then((documents) => {
                this.documents = documents;
                this.loader.hideLoader();
              })
          })
      } else {
        this.docService.getFolder(this.current_folder_id)
          .then((folder) => {
            this.current_folder = folder;
            this.documents = [];
            this.current_folder.documents.forEach((docId) => {
              this.docService.getDocument(docId)
                .then((document) => {
                  if (document !== null) {
                    this.documents?.push(document);
                  }
                });
            });
            this.loader.hideLoader();
          })
      }
    });
  }

  openDocument(docRef: string) {
    this.router.goto(["viewer"], {docId: docRef});
  }

  deleteDocument(docId: string) {
    this.loader.showLoader();
    this.docService.deleteDocument(docId)
      .then((deleted) => {
        if (deleted && this.documents) {
          for (let i = 0; i < this.documents.length; i++) {
            if (this.documents[i].id === docId) {
              this.documents.splice(i, 1);
              break;
            }
          }
        }
        this.loader.hideLoader();
      })
  }

  createNewFolder() {
    this.loader.showLoader();
    this.docService.createFolder(this.folderName)
      .then((folder) => {
        this.isCreateFolder = false;
        this.folderName = undefined;
        if (this.folders) {
          this.folders = [folder, ...this.folders];
        } else {
          this.folders = []
          this.folders.push(folder);
        }
        this.loader.hideLoader();
      })
  }

  openFolder(folderId: string) {
    this.router.goto(["folders", folderId])
  }

  goToDefaultFolder() {
    this.router.goto(["folders", "default"])
  }

  deleteFolder(folderId: string) {
    this.loader.showLoader();
    this.docService.deleteFolder(folderId)
      .then((isDeleted) => {
        if (isDeleted && this.folders) {
          for (let i = 0; i < this.folders.length; i++) {
            if (this.folders[i].id === folderId) {
              this.folders.splice(i, 1);
            }
          }
        }
        this.loader.hideLoader();
      });
  }
  
  favouriteDocument(docId: string) {
    this.loader.showLoader();
    this.docService.toggleFavouriteDocument(docId)
      .then((updated) => {
        if (this.documents) {
          for (let i = 0; i < this.documents.length; i++) {
            if (this.documents[i].id === docId) {
              this.documents[i].is_favourite = updated.is_favourite;
              break;
            }
          }
        }
        this.loader.hideLoader();
      })
  }

  openUploadModal() {
    this.modalCtrl.create({
      component: FileUploadComponent,
      animated: true,
      cssClass: "default-modal",
      backdropDismiss: true,
      componentProps: {
        destinationFolder: this.current_folder_id || "default"
      },
      
    }).then((modal) => {
      modal.onDidDismiss()
        .then((dismissData) => {
          if (dismissData.data) {
            console.log(dismissData.data)
            if (dismissData.data.docId) {

              this.openDocument(dismissData.data.docId);
            }
          }
        });
      modal.present();
    });
  }
}
