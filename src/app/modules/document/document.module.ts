import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentListComponent } from './document-list/document-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { AddDocumentComponent } from './add-document/add-document.component';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'document-list',
  },
  {
    path: 'document-list',
    component: DocumentListComponent,
  },
];

@NgModule({
  declarations: [DocumentListComponent, AddDocumentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ButtonModule,
    MenuModule,
    BadgeModule,
    DropdownModule,
    SidebarModule,
    InputTextModule,
    EditorModule,
    OverlayPanelModule,
    ListboxModule,
    ReactiveFormsModule,
  ],
})
export class DocumentModule {}
