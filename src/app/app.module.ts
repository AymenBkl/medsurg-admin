import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuardService } from './services/auth-guard.service';
import { InteractionService } from './services/interaction.service';
import { InterceptorService, UnauthorizedInterceptor } from './services/interceptor.service';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { ProccessHttpErrosService } from './services/proccess-http-erros.service';
import { CategoryService } from './services/crm/category.service';
import { ProductService } from './services/crm/product.service';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';
import { config } from './services/config';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';


import { MessagesService } from './services/messages/messages.service';
import { OrderService } from './services/crm/order.service';
import { ReferalService } from './services/crm/referal.service';
import { AllproductsService } from './services/crm/allproducts.service';
import { PrescriptionService } from './services/prescription.service';
import { UsermanagenetService } from './services/usermanagenet.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuardService,
    AuthService,
    InteractionService,
    StorageService,
    ProccessHttpErrosService,
    CategoryService,
    ProductService,
    FileChooser,
    MessagesService,
    OrderService,
    ReferalService,
    AllproductsService,
    File,
    PrescriptionService,
    UsermanagenetService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide : 'bucketURL', useValue : config.bucket},
    NavParams
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
