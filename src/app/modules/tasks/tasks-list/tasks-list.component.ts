import { Component } from '@angular/core';
import { tabs } from '../../../shared/components/tm-tabs/tm-tabs.component';
import { MenuItem } from 'primeng/api';
import { Data } from '../../../shared/components/progress-card/progress-card.component';
import { TableColumn } from '../../../shared/components/tm-table/tm-table.component';
import { AuthService } from '../../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import { storedDetails } from '../../../store/auth/auth.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent {
  authData: any;
  // Add/editMode of task
  isEdit: boolean = false;
  formDataOfEditTask: any = '';
  // tabs
  tabList: tabs[] = [
    { label: 'List', icon: 'pi pi-list' },
    { label: 'Board', icon: 'pi pi-objects-column' },
    { label: 'Timeline', icon: 'pi pi-align-center' },
    { label: 'Table', icon: 'pi pi-table' },
  ];
  tabCounts = [0, 0];
  currentTab: string = 'List';
  sidebarVisible: boolean = false;
  customClass: any = 'custom-class';

  isLoading: boolean = false;

  // dropdownValues

  constructor(
    private apiService: AuthService,
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.store.select(storedDetails).subscribe((data) => {
      this.authData = data;
      console.log('Auth Data:', this.authData);
    });
    this.getTaskList();
  }
  // Handle tab change event
  onTabChange(selectedTab: string) {
    this.currentTab = selectedTab;
  }

  // Menu
  items: MenuItem[] = [
    {
      label: 'Task',
      command: () => {
        this.addTask('task');
      },
    },
    {
      label: 'Recursive',
      command: () => {
        this.addTask('recursive');
      },
    },
  ];

  columns: TableColumn[] = [
    { header: 'Task', field: 'Task_Name', isNested: false, sortKey: 'task', isNestedTree: false },
    { header: 'Assignee', field: 'Responsible', isNested: false, sortKey: 'assignee' },
    { header: 'Status', field: 'Status', statusField: true, sortKey: 'status' },
    {
      header: 'Due Date',
      field: 'Completion_Date',
      pipeParams: 'dd MMM yyyy',
      sortKey: 'dueDate',
    },
    { header: 'Priority', field: 'priority', isNested: false, sortKey: 'priority' },
    { header: 'Files', field: 'files', isNested: false },
    { header: 'Tags', field: 'Tags', isNested: false },
    { header: 'Summary', field: 'summary', isNested: false },
    { header: 'Actions', isAction: true },
  ];
  nestedColumn: TableColumn[] = [
    { header: 'label', field: 'label', isNested: false, sortKey: 'label', isColumnVisible: true },
    { header: '', field: '', isColumnVisible: false },
    { header: '', field: '', isColumnVisible: false },
    { header: '', field: '', isColumnVisible: false },
    { header: '', field: '', isColumnVisible: false },
    { header: '', field: '', isColumnVisible: false },
    { header: '', field: '', isColumnVisible: false },
    { header: '', field: '', isColumnVisible: false },
    { header: '', field: '', isColumnVisible: false },
  ];
  data: any[] = [];
  // data: any[] = [
  //   {
  //     isExpandable: true,
  //     task: [{
  //       data: {
  //         label: 'T1',
  //         expanded: false,
  //       },

  //       children: [
  //         {
  //           data: {
  //             label: 'T2',
  //             expanded: false,
  //           },

  //           children: [
  //             {
  //               data: {
  //                 label: 'T3',
  //                 expanded: false,
  //               },
  //               children: [
  //                 {
  //                   data: {
  //                     label: 'T4',
  //                     expanded: true,
  //                   },
  //                   children: [{
  //                     data: {
  //                       label: 'T5', expanded: false
  //                     }
  //                   }],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           data: {
  //             label: 'T2',
  //             expanded: false,
  //           },
  //           children: [{
  //             data: {
  //               label: 'T3',
  //               expanded: false
  //             }
  //           }]
  //         }
  //       ],
  //     }
  //     ],
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
  //     isExpandable: false,
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
  //     isExpandable: false,
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
  //     isExpandable: false,
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
  //     isExpandable: false,
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
  //     isExpandable: false,
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
  //     isExpandable: false,
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
  //     isExpandable: false,
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
  //     isExpandable: false,
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

  addTask(type: string) {
    this.sidebarVisible = true;
  }
  onAdditionOfTask(event: any) {
    this.getTaskList();
    this.sidebarVisible = !this.sidebarVisible;
  }
  // getPropertyDropdownDetails() {
  //   // CommonApi/Task-Management/Get-Option_NT
  //   let url = 'CommonApi/Task-Management/Get-Option_NT';
  //   const body = {
  //     Type_Code: "PROJECT",
  //     Master_Mkey: ""
  //   }
  //   this.apiService.postDetails(url, body).subscribe((res) => {
  //     this.propertyDropdownValues = res.Data;
  //   });
  // }
  getTaskList() {
    let url = 'Task-Management/Task-Dashboard_NT';
    const body = {
      Current_Emp_Mkey: this.authData.Mkey.toString(),
      Filter: '',
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    this.isLoading = true;
    this.apiService.postDetails(url, body, true).subscribe(
      (res: any) => {
        this.data = res[0].Data;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      },
    );
  }
  onEditOfCard(event: any) {
    console.log(event);
    this.formDataOfEditTask = event;
    this.isEdit = true;
    this.sidebarVisible = !this.sidebarVisible;
  }
  handleViewDetail(event: any) {
    this.router.navigate([`tasks/task-details/${event.Mkey}`]);
  }
}
