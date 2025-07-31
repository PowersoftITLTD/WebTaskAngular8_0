import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './views/login/login.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/root-reducer';
import { MessageService } from 'primeng/api';
import { localStorageSyncReducer, rehydrateState } from './store/persist-meta.reduser';
import { CoreModule } from './core/core.module';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    CoreModule,
    BrowserAnimationsModule,
    LoginModule,
    StoreModule.forRoot(reducers, {
      metaReducers: [localStorageSyncReducer],
      initialState: rehydrateState(),
    }),
    ToastModule,
    NgxSpinnerModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
