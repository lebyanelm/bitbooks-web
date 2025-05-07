import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentViewerPage } from './document-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentViewerPageRoutingModule {}
