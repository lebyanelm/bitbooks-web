import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DocumentViewerPageRoutingModule } from './document-viewer-routing.module';
import { DocumentViewerPage } from './document-viewer.page';
import { ComponentsModule } from 'src/app/modules/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    DocumentViewerPageRoutingModule
  ],
  declarations: [
    DocumentViewerPage
  ]
})
export class DocumentViewerPageModule {}
