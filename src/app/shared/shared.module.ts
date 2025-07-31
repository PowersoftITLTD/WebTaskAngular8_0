import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarModule } from 'primeng/sidebar';
import { StyleClassModule } from 'primeng/styleclass';
import { RouterModule } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { TmTabsComponent } from './components/tm-tabs/tm-tabs.component';
import { TmAdvanceSearchComponent } from './components/tm-advance-search/tm-advance-search.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressCardComponent } from './components/progress-card/progress-card.component';
import { GroupByPipe } from './pipes/group-by.pipe';
import { TmTableComponent } from './components/tm-table/tm-table.component';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuModule } from 'primeng/menu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TmEditComponent } from './components/tm-edit/tm-edit.component';
import { InputComponent } from './components/common/input/input.component';
import { ButtonComponent } from './components/common/button/button.component';

import { TmTreeViewComponent } from './components/tm-tree-view/tm-tree-view.component';
import { TreeModule } from 'primeng/tree';
import { isArrayPipe } from './pipes/type-check.pipe';
import { TreeTableModule } from 'primeng/treetable';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { BreadcrumbsComponent } from './components/common/breadcrumbs/breadcrumbs.component';
import { AvatarModule } from 'primeng/avatar';
import { SliderModule } from 'primeng/slider';
import { FileUploadModule } from 'primeng/fileupload';
import { NoDataFoundComponent } from './components/common/no-data-found/no-data-found.component';
import { ConfirmDialogComponent } from './components/common/confirm-dialog/confirm-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { ShortNamePipe } from './pipes/short-name.pipe';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    TmTabsComponent,
    TmAdvanceSearchComponent,
    ProgressCardComponent,
    GroupByPipe,
    TmTableComponent,
    TmEditComponent,
    InputComponent,
    ButtonComponent,
    TmTreeViewComponent,
    isArrayPipe,
    BreadcrumbsComponent,
    NoDataFoundComponent,
    ConfirmDialogComponent,
    ShortNamePipe,
  ],
  imports: [
    CommonModule,
    SidebarModule,
    StyleClassModule,
    RouterModule,
    OverlayPanelModule,
    CalendarModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    SkeletonModule,
    MenuModule,
    InputSwitchModule,
    TreeModule,
    TreeTableModule,
    ToastModule,
    TreeTableModule,
    ProgressBarModule,
    AvatarModule,
    SliderModule,
    FileUploadModule,
    DialogModule,
  ],
  exports: [
    TmTabsComponent,
    TmAdvanceSearchComponent,
    ProgressCardComponent,
    TmTableComponent,
    GroupByPipe,
    TmEditComponent,
    InputComponent,
    ButtonComponent,
    TmTreeViewComponent,
    isArrayPipe,
    BreadcrumbsComponent,
    ProgressBarModule,
    AvatarModule,
    SliderModule,
    CalendarModule,
    FileUploadModule,
    FormsModule,
    NoDataFoundComponent,
    ConfirmDialogComponent,
    DialogModule,
    ShortNamePipe,
  ],
})
export class SharedModule {}
