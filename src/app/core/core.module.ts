import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { ErrorMessagingComponent } from './components/error-messaging/error-messaging.component';
import { MaterialModule } from '../material/material.module';
import { NgxTranslateModule } from '../ngx-translate/ngx-translate.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { XhrInterceptor } from './interceptors/xhr.interceptor';
import { YesNoDialogComponent } from './components/yes-no-dialog/yes-no-dialog.component';

@NgModule({
  declarations: [LoadingComponent, ErrorMessagingComponent, YesNoDialogComponent],
  imports: [CommonModule, MaterialModule, NgxTranslateModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }],
  entryComponents: [YesNoDialogComponent],
  exports: [LoadingComponent, ErrorMessagingComponent, YesNoDialogComponent]
})
export class CoreModule {}
