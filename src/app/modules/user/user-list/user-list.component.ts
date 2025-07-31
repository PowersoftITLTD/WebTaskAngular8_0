import { Component } from '@angular/core';
import { TableColumn } from '../../../shared/components/tm-table/tm-table.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [DatePipe],
})
export class UserListComponent {

  constructor(private router: Router) {}

  userList: any[] = [
    {
      userId: 79,
      userName: "Aamir",
      firstName: "Aamir",
      lastName: "Siddique",
      email: "Aamirsiddique@ts.com",
      passwordHash: "",
      isActive: true,
      createdAt: "2024-12-24T15:21:18.117Z",
      createdBy: "Jagdish",
      modifiedAt: "2025-03-09T18:22:59.39",
    },
    {
      userId: 121,
      userName: "Adarsh",
      firstName: "Adarsh",
      lastName: "Chavan",
      email: "a@gmail.com",
      passwordHash: "",
      isActive: true,
      createdAt: "2025-03-05T06:54:01.187Z",
      createdBy: "Aamir",
      modifiedAt: "2025-03-09T18:12:49.02",
    },
    {
      userId: 122,
      userName: "Chetan",
      firstName: "Chetan",
      lastName: "Chavan",
      email: "sh@gmail.com",
      passwordHash: "",
      isActive: true,
      createdAt: "2025-03-05T09:37:57.590Z",
      createdBy: "Adarsh",
      modifiedAt: "2025-03-05T15:09:18.337",
    },
    {
      userId: 118,
      userName: "Pratik",
      firstName: "Pratik",
      lastName: "More",
      email: "p1@gmail.com",
      passwordHash: "",
      isActive: true,
      createdAt: "2025-02-20T09:58:07.097Z",
      createdBy: "Aamir",
      modifiedAt: "2025-02-26T14:49:28.033",
    },
    {
      userId: 120,
      userName: "Anil",
      firstName: "Anil",
      lastName: "Prajapati",
      email: "anil.prajapati@powersoft.in",
      passwordHash: "",
      isActive: true,
      createdAt: "2025-02-21T10:24:05.997Z",
      createdBy: "Pratik",
      modifiedAt: "2025-02-21T15:54:05.997",
    },
    {
      userId: 117,
      userName: "Shubham",
      firstName: "Shubham",
      lastName: "Chavan",
      email: "s@gmail.com",
      passwordHash: "",
      isActive: true,
      createdAt: "2025-02-20T09:56:38.977Z",
      createdBy: "Aamir",
      modifiedAt: "2025-02-20T15:26:38.98",
    },
  ];
  
  columns: TableColumn[] = [
    { header: 'User Name', field: 'userName', sortKey: 'UserName' },
    { header: 'Email', field: 'email', sortKey: 'Email' },
    {
      header: 'Created by & on',
      isNested: true,
      nestedFields: ['createdBy', 'createdAt'],
      pipe: 'date',
      pipeParams: 'dd MMM, yyyy hh:mm a',
      sortKey: 'CreatedAt',
    },
    { header: '', isAction: true },
  ];
  handleViewDetails(user: any) {
    this.router.navigateByUrl(`user/user-edit/${user.userId}`);
  }

  navigateToAddUser() {
    this.router.navigateByUrl('user/user-add');
  }
}
