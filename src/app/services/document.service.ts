import { Injectable } from '@angular/core';
import { IDocumentData } from '../interfaces/IDocumentData';
import * as superagent from "superagent";
import { environment } from 'src/environments/environment';
import { IPageReadAnnotation, IPageReadRep } from '../interfaces/IPageReadAnnotations';
import { IFolder } from '../interfaces/IFolder';
import { nanoid } from "nanoid"

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor() { }
  createDocument(file: any, destinationFolder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const document_id = nanoid();
      setTimeout(() => {
        superagent.post([environment.backend, "uploads"].join("/"))
          .field("destination_folder", destinationFolder)
          .field("document_id", document_id)
          .attach('document', file)
          .end();
      }, 1000);
      resolve(document_id)
    });
  } 
  
  getDocument(docId: string): Promise<IDocumentData> {
    return new Promise((resolve, reject) => {
      superagent.get([environment.backend, "documents", docId].join("/"))
        .end((_, response) => {
          if (response.statusCode == 200) {
            resolve(response.body.data);
          } else {
            reject(response.body);
          }
        });
    });
  }

  getDocuments(): Promise<IDocumentData[] | undefined> {
    return new Promise((resolve, reject) => {
      superagent.get([environment.backend, "documents"].join("/"))
        .end((_, response) => {
          if (response.statusCode == 200) {
            resolve(response.body.data);
          } else {
            reject(response.body);
          }
        });
    });
  }

  toggleFavouriteDocument(docId: string): Promise<IDocumentData> {
    return new Promise((resolve, reject) => {
      superagent.get([environment.backend, "documents", docId, "favourite"].join("/"))
        .end((_, response) => {
          if (response.statusCode == 200) {
            resolve(response.body.data);
          } else {
            reject(response.body);
          }
        });
    });
  }

  deleteDocument(docId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      superagent.delete([environment.backend, "documents", docId].join("/"))
        .end((_, response) => {
          if (response.statusCode == 200) {
            resolve(true);
          } else {
            reject(response.body);
          }
        });
    });
  }
  
  getPageReadAnnotations(docId: string, pageNumber: number): Promise<IPageReadRep> {
    return new Promise((resolve, reject) => {
      superagent.get([environment.backend, "documents", docId, "read_annotations", pageNumber].join('/'))
        .end((_, response) => {
          if (response.statusCode === 200) {
            resolve(response.body.data);
          } else {
            reject(response.body);
          }
        })
    });
  } 

  createFolder(folder_name: string | undefined): Promise<IFolder> {
    return new Promise((resolve, reject) => {
      superagent.get([environment.backend, "new_folder", folder_name].join('/'))
        .end((_, response) => {
          if (response.statusCode === 200) {
            resolve(response.body.data);
          } else {
            reject(response.body);
          }
        })
    });
  }

  getFolders(): Promise<IFolder[]> {
    return new Promise((resolve, reject) => {
      superagent.get([environment.backend, "folders"].join('/'))
        .end((_, response) => {
          if (response.statusCode === 200) {
            resolve(response.body.data);
          } else {
            reject(response.body);
          }
        })
    });
  }

    getFolder(folderId: string | undefined): Promise<IFolder> {
    return new Promise((resolve, reject) => {
      superagent.get([environment.backend, "folders", folderId].join('/'))
        .end((_, response) => {
          if (response.statusCode === 200) {
            resolve(response.body.data);
          } else {
            reject(response.body);
          }
        })
    });
  }
  
  deleteFolder(folderId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      superagent.delete([environment.backend, "folders", folderId].join('/'))
        .end((_, response) => {
          if (response.statusCode === 200) {
            resolve(true);
          } else {
            reject(response.body);
          }
        })
    })
  }
}
