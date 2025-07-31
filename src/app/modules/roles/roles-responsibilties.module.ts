import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesResponsibilitiesAddComponent } from './roles-responsibilities-add/roles-responsibilities-add.component';
import { RolesResponsibilitiesListComponent } from './roles-responsibilities-list/roles-responsibilities-list.component';
import { RolesResponsibilitiesViewComponent } from './roles-responsibilities-view/roles-responsibilities-view.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';


const routes: Routes = [
  { path: '', redirectTo: 'role-list', pathMatch: 'full' },
  { path: 'role-list', component: RolesResponsibilitiesListComponent },
  { path: 'role-add', component: RolesResponsibilitiesAddComponent },
  { path: 'role-edit/:id', component: RolesResponsibilitiesAddComponent },
  { path: 'role-view/:id', component: RolesResponsibilitiesViewComponent },
];

@NgModule({
  declarations: [
    RolesResponsibilitiesAddComponent,
    RolesResponsibilitiesListComponent,
    RolesResponsibilitiesViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    
  ],
})
export class RolesResponsibilitiesModule {}
