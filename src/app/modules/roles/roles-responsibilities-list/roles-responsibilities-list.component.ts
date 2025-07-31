import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn } from '../../../shared/components/tm-table/tm-table.component';

@Component({
  selector: 'app-roles-responsibilities-list',
  templateUrl: './roles-responsibilities-list.component.html',
  styleUrl: './roles-responsibilities-list.component.scss',
})
export class RolesResponsibilitiesListComponent {
  constructor(private router: Router) {}
  rolesList: any[] = [
    {
      roleId: 79,
      roleName: 'New Role',
      isActive: true,
      createdAt: '2024-12-24T15:21:18.117Z',
      createdBy: 'Jagdish',
      modifiedAt: '2025-03-09T18:22:59.39',

      moduleAssigned: 21,
    },
    {
      roleId: 121,
      roleName: 'Test Role',
      isActive: true,
      createdAt: '2025-03-05T06:54:01.187Z',
      createdBy: 'Aamir',
      modifiedAt: '2025-03-09T18:12:49.02',

      moduleAssigned: 21,
    },
    {
      roleId: 122,
      roleName: 'Approver',
      isActive: true,
      createdAt: '2025-03-05T09:37:57.590Z',
      createdBy: 'Adarsh',
      modifiedAt: '2025-03-05T15:09:18.337',
      moduleAssigned: 21,
    },
    {
      roleId: 118,
      roleName: 'Read only',
      isActive: true,
      createdAt: '2025-02-20T09:58:07.097Z',
      createdBy: 'Aamir',
      modifiedAt: '2025-02-26T14:49:28.033',
      moduleAssigned: 21,
    },
    {
      roleId: 120,
      roleName: 'Admin',
      isActive: true,
      createdAt: '2025-02-21T10:24:05.997Z',
      createdBy: 'Pratik',
      modifiedAt: '2025-02-21T15:54:05.997',
      moduleAssigned: 21,
    },
  ];

  columns: TableColumn[] = [
    { header: 'Role Name', field: 'roleName', sortKey: 'RoleName' },
    {
      header: 'Created by & on',
      isNested: true,
      nestedFields: ['createdBy', 'createdAt'],
      pipe: 'date',
      pipeParams: 'dd MMM, yyyy hh:mm a',
      sortKey: 'CreatedAt',
    },
    { header: 'Module assigned', field: 'moduleAssigned', sortKey: 'ModuleAssigned' },
    { header: '', isAction: true },
  ];
  navigateToPocketAdd() {
    this.router.navigateByUrl('/role/role-add');
  }

  handleViewDetails(role: any) {
    this.router.navigateByUrl(`/role/role-view/${role.roleId}`);
  }
}
