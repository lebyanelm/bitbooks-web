import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'folders/:folder_name',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    title: "Doku | Browse documents"
  },
  {
    path: 'viewer',
    loadChildren: () => import('./pages/document-viewer/document-viewer.module').then( m => m.DocumentViewerPageModule),
    title: "Doku | Document Viewer "
  },
  {
    path: '',
    redirectTo: 'folders/default',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
