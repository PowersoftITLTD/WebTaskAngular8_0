import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComplianceListComponent } from './compliance-list/compliance-list.component';
import { AddComplianceComponent } from './add-compliance/add-compliance.component';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccordionModule } from 'primeng/accordion';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'compliance-list',
  },
  {
      path: 'compliance-list',
      component: ComplianceListComponent,
    },
 
];

@NgModule({
  declarations: [ 
    ComplianceListComponent, AddComplianceComponent
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
    ReactiveFormsModule,
  ],
})
export class ComplianceModule {}
