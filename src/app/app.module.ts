import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'
import { CallInfoDialogComponents } from './dialog/callinfo-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CallService } from './call.service';
import { StatusService } from './status.service';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ShapeService } from './shape.service';
// import { FreehandCanvasComponent } from './canvas/freehandcanvas';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    CallInfoDialogComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
    MatSnackBarModule,
    MatIconModule,
    HttpClientModule,
    MatToolbarModule,
    MatDividerModule
  ],
  providers: [
    ShapeService,
    CallService,
    StatusService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
