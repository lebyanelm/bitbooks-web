import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { IonicModule } from '@ionic/angular';
import { ViewerControllerComponent } from 'src/app/components/viewer-controller/viewer-controller.component';
import { PDFViewerComponent } from 'src/app/components/pdf-viewer/pdf-viewer.component';
import { BrandIconComponent } from 'src/app/components/brand-icon/brand-icon.component';
import { FileUploadComponent } from 'src/app/modals/file-upload/file-upload.component';
import { DeleteConfirmComponent } from 'src/app/modals/delete-confirm/delete-confirm.component';

@NgModule({
  declarations: [
    HeaderComponent,
    PDFViewerComponent,
    ViewerControllerComponent,
    BrandIconComponent,
    FileUploadComponent,
    DeleteConfirmComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    PDFViewerComponent,
    ViewerControllerComponent,
    BrandIconComponent,
    FileUploadComponent,
    DeleteConfirmComponent
  ]
})
export class ComponentsModule { }
