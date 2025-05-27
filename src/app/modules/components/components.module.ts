import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { DocumentContainerComponent } from "../../components/document-container/document-container.component";
import { HeaderComponent } from "../../components/header/header.component";
import { IonicModule } from '@ionic/angular';
import { ViewerControllerComponent } from 'src/app/components/viewer-controller/viewer-controller.component';

@NgModule({
  declarations: [
    HeaderComponent,
    DocumentContainerComponent,
    ViewerControllerComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    DocumentContainerComponent,
    ViewerControllerComponent
  ]
})
export class ComponentsModule { }
