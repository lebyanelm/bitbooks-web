import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { DocumentContainerComponent } from "../../components/document-container/document-container.component";
import { HeaderComponent } from "../../components/header/header.component";
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    HeaderComponent,
    DocumentContainerComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    DocumentContainerComponent
  ]
})
export class ComponentsModule { }
