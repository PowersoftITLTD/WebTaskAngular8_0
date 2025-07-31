import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface Role {
  subModuleName: string;
  moduleName: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}
interface BreadcrumbItem {
  label: string;
  url: string;
  queryParam?: string;
}
@Component({
  selector: 'app-roles-responsibilities-view',
  templateUrl: './roles-responsibilities-view.component.html',
  styleUrls: ['./roles-responsibilities-view.component.scss'],
})
export class RolesResponsibilitiesViewComponent {
  router = inject(Router);
  title: string = 'Manager';
  roleId: any;
  isLoading: boolean = false;
  isDeletingRole: boolean = false;
  dataVisible = false;
  noOfUsers: number = 0;
  disableDelete: boolean = false;
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Roles & Responsibilities', url: '/role' },
    { label: 'Manager', url: '/' },
  ];
  rolesArr: Role[] = [
    {
      subModuleName: 'Statutory_Approval',
      moduleName: 'Approval',
      canRead: true,
      canWrite: true,
      canDelete: true,
    },
    {
      subModuleName: 'List_of_Agreement',
      moduleName: 'Agreement',
      canRead: true,
      canWrite: true,
      canDelete: true,
    },
    {
      subModuleName: 'Statutory_Approval',
      moduleName: 'Approval',
      canRead: true,
      canWrite: true,
      canDelete: true,
    },
    {
      subModuleName: 'List_of_Agreement',
      moduleName: 'Agreement',
      canRead: false,
      canWrite: false,
      canDelete: true,
    },
  ];

  hasAccess = {
    canWrite: true,
    canDelete: true,
  };

  hasError = this.rolesArr.length === 0;

  handleDelete(): void {
    this.dataVisible = true;
    if (this.noOfUsers > 0) {
      this.disableDelete = true;
    } else {
      this.disableDelete = false;
    }
  }
  saveData() {
    this.isDeletingRole = true;
  }
  handleEdit(): void {
    this.router.navigateByUrl(`/role/role-edit/${this.roleId}`);
  }

  goToAdd(): void {
    this.router.navigateByUrl('/role/role-add');
  }
}
