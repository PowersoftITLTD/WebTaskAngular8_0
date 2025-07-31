import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';
import { template } from 'lodash';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then((c) => c.LoginModule),
    // canActivate: [noAuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      {
        path: 'tasks',
        loadChildren: () => import('./modules/tasks/tasks.module').then((c) => c.TasksModule),
        data: { name: 'Tasks' },
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./modules/user/user.module').then((c) => c.UserModule),
        data: { name: 'User' },
      },
      {
        path: 'role',
        loadChildren: () =>
          import('./modules/roles/roles-responsibilties.module').then((c) => c.RolesResponsibilitiesModule),
        data: { name: 'Role' },
      },
      {
        path: 'project',
        loadChildren: () => import('./modules/project/project.module').then((c) => c.ProjectModule),
        data: { name: 'Project' },
      },
      {
        path: 'document',
        loadChildren: () =>
          import('./modules/document/document.module').then((c) => c.DocumentModule),
        data: { name: 'Project' },
      },
      {
        path: 'compliance',
        loadChildren: () =>
          import('./modules/compliance/compliance.module').then((c) => c.ComplianceModule),
        data: { name: 'Project' },
      },
      {
        path:'template',
        loadChildren:()=>
          import('./modules/approval/approval.module').then((c)=>c.ApprovalModule),
        data:{ name:'project' }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
