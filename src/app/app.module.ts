import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ComponentsModule } from "./modules/components/components.module";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterService } from './services/router.service';
import { LoaderService } from './services/loader.service';
import { AudioService } from './services/audio.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({animated: false}),
    AppRoutingModule,
    ComponentsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    RouterService,
    LoaderService,
    AudioService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
