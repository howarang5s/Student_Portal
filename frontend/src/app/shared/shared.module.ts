import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';




import { passwordMatchValidator } from './validaors/validator.component';

@NgModule({
  declarations: [], 
  imports: [
    
        MatCardModule,
        ReactiveFormsModule,
        MatTableModule,
        MatSelectModule,
        MatIconModule,
        HttpClientModule,
        MatRadioModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatMenuModule,
        CommonModule,
        MatDialogModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatButtonModule,
        MatOptionModule,
        MatTooltipModule,
        
    
  ],
  exports: [
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatOptionModule,
    HttpClientModule,
    MatRadioModule, 
    MatFormFieldModule,
    MatMenuModule, 
    MatSidenavModule, 
    MatListModule
  ],
  providers: []
})
export class SharedModule {}
