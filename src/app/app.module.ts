import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ComponentsModule } from "./modules/components/components.module";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranscriptionService } from './services/transcription.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    TranscriptionService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
