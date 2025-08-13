import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { tabs } from '../../../shared/components/tm-tabs/tm-tabs.component';
import { storedDetails } from '../../../store/auth/auth.selectors';

import { Store } from '@ngrx/store';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrl: './approval-list.component.scss'
})
export class ApprovalListComponent {


  sidebarVisible: boolean = false;
  authData: any;
  isLoading: boolean = false;
  data: any[] = [];
  templateData:any[] = [];

  constructor(private router: Router, private store: Store, private apiService: AuthService) { }

  home: MenuItem | undefined;
  tabCounts = [0, 0];
  currentTab: string = 'Approval Template';

  tabList: tabs[] = [
    { label: 'Approval Template', icon: 'pi pi-list' },
    { label: 'Document Template', icon: 'pi pi-objects-column' },
    { label: 'Categories', icon: 'pi pi-align-center' },
    { label: 'Instruction', icon: 'pi pi-table' },
  ];

  ngOnInit() {
    this.store.select(storedDetails).subscribe((data) => {
      this.authData = data;
    });
    this.getTemplateList();
  }

  onTabChange(selectedTab: string) {
    this.currentTab = selectedTab;
  }

  items: MenuItem[] = [
    { label: 'List', command: () => this.edit('List') },
    { label: 'Task 1', command: () => this.edit('Task 1') },
  ];

  edit(param?: any) {
    if (param == 'List') {
      this.router.navigate(['/tasks', 'task-list'], { // Change to project-details
      });
    }
  }

  addApproval() {
    this.sidebarVisible = true;
    //console.log('this.sidebarVisible: ', this.sidebarVisible);
  }


  getTemplateList() {
    let url = 'Approval-Template-Get-NT';
    const body = {
      Mkey:0,
      Session_User_Id: this.authData?.Session_User_Id,
      Business_Group_Id: this.authData?.Business_Group_Id,
    };
    this.isLoading = true;
    this.apiService.postDetails(url, body, false, false, true).subscribe(
      (res: any) => {
        this.templateData = res[0].Data;
         console.log('Check approval get data: ', res[0].Data)
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      },
    );
  }

  // data: any[] = [
  //   {
  //     task: 'T1',
  //     assignee: 'Rishabh Utekar',
  //     status: 'notStarted',
  //     dueDate: '2025-01-14',
  //     priority: 'medium',
  //     files: ['file1.png', 'file2.docx'],
  //     tags: ['ABC', 'Test'],
  //     summary: 'Create a design system for a hero section in 2 different variants.',
  //     isCancel: false,
  //   },
  //   {
  //     task: 'T3',
  //     assignee: 'Rishabh Utekar',
  //     status: 'inProcess',
  //     dueDate: '2025-01-14',
  //     priority: 'high',
  //     files: ['file3.pdf'],
  //     tags: ['ABC', 'Test'],
  //     summary: 'Create a simple presentation with a focus on typography.',
  //     isCancel: false,
  //   },
  //   {
  //     task: 'T4',
  //     assignee: 'Rishabh Utekar',
  //     status: 'inProcess',
  //     dueDate: '2025-01-14',
  //     priority: 'low',
  //     files: [],
  //     tags: ['ABC', 'Test'],
  //     summary: 'Work on a dashboard UI with dark mode support.',
  //     isCancel: false,
  //   },
  //   {
  //     task: 'T5',
  //     assignee: 'Rishabh Utekar',
  //     status: 'inProcess',
  //     dueDate: '2025-01-14',
  //     priority: 'medium',
  //     files: ['file4.jpg'],
  //     tags: ['ABC', 'Test'],
  //     summary: 'Design an e-commerce product page with interactive elements.',
  //     isCancel: false,
  //   },
  //   {
  //     task: 'T6',
  //     assignee: 'Rishabh Utekar',
  //     status: 'notStarted',
  //     dueDate: '2025-01-14',
  //     priority: 'high',
  //     files: [],
  //     tags: ['ABC', 'Test'],
  //     summary: 'Develop a wireframe for a fintech mobile app.',
  //     isCancel: false,
  //   },
  //   {
  //     task: 'T7',
  //     assignee: 'Rishabh Utekar',
  //     status: 'inProcess',
  //     dueDate: '2025-01-14',
  //     priority: 'low',
  //     files: ['file5.svg'],
  //     tags: ['ABC', 'Test'],
  //     summary: 'Create motion graphics for social media branding.',
  //     isCancel: false,
  //   },
  //   {
  //     task: 'T8',
  //     assignee: 'Rishabh Utekar',
  //     status: 'inProcess',
  //     dueDate: '2025-01-14',
  //     priority: 'medium',
  //     files: [],
  //     tags: ['ABC', 'Test'],
  //     summary: 'Redesign the homepage for a SaaS product website.',
  //     isCancel: false,
  //   },
  //   {
  //     task: 'T9',
  //     assignee: 'Rishabh Utekar',
  //     status: 'notStarted',
  //     dueDate: '2025-01-14',
  //     priority: 'low',
  //     files: ['file6.zip'],
  //     tags: ['ABC', 'Test'],
  //     summary: 'Explore color palette variations for branding guidelines.',
  //     isCancel: false,
  //   },
  //   {
  //     task: 'T10',
  //     assignee: 'Rishabh Utekar',
  //     status: 'completed',
  //     dueDate: '2025-01-14',
  //     priority: 'high',
  //     files: ['file7.png'],
  //     tags: ['ABC', 'Test'],
  //     summary: 'Prototype a mobile navigation system with gestures.',
  //     isCancel: false,
  //   },
  // ];

}
