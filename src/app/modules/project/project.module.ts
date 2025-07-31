import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { ProjectDefinationListComponent } from './project-defination-list/project-defination-list.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { PropertyCardComponent } from './property-card/property-card.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AddNewProjectComponent } from './add-new-project/add-new-project.component';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { ReactiveFormsModule } from '@angular/forms';
//import { AddApprovalComponent } from './add-approval/add-approval.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'project-list',
  },
  {
    path: 'project-list',
    component: ProjectDefinationListComponent,
  },
  {
    path: ':project-details',
    component: ProjectListComponent,
  },
  // {
  //   path:'template',
  //   component:AddApprovalComponent
  // }
];

@NgModule({
  declarations: [
    ProjectDefinationListComponent,
    ProjectListComponent,
    StatusCardComponent,
    PropertyCardComponent,
    AddNewProjectComponent,
    // AddApprovalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ButtonModule,
    MenuModule,
    BadgeModule,
    BreadcrumbModule,
    DropdownModule,
    SidebarModule,
    InputTextModule,
    EditorModule,
    OverlayPanelModule,
    ListboxModule,
    ReactiveFormsModule,
  ],
})
export class ProjectModule {}
