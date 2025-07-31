import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddApprovalComponent } from './add-approval/add-approval.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
//import { SharedModule } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SharedModule } from '../../shared/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';


const routes:Routes = [
  {path:'', redirectTo:'template-list', pathMatch:'full'},
  {path:'add-template', component:AddApprovalComponent},
  {path:'template-list', component:ApprovalListComponent}

]


@NgModule({
  declarations: [
    AddApprovalComponent,
    ApprovalListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    ButtonModule,
    MenuModule,
    BadgeModule,
    TooltipModule,
    SidebarModule,
    InputTextModule,
    EditorModule,
    OverlayPanelModule,
    ListboxModule,
    DropdownModule,
    CalendarModule,
    InputSwitchModule,
    AccordionModule,
    IconFieldModule,
    InputIconModule,
    CheckboxModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    SharedModule,
    MultiSelectModule
  ]
})
export class ApprovalModule { }
