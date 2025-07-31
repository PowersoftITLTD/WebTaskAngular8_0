import { Component, inject } from '@angular/core';
import { tabs } from '../../../shared/components/tm-tabs/tm-tabs.component';
import { TableColumn } from '../../../shared/components/tm-table/tm-table.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import { storedDetails } from '../../../store/auth/auth.selectors';

interface BreadcrumbItem {
  label: string;
  url: string;
  queryParam?: string; // Optional query param
}

@Component({
  selector: 'app-tasks-details',
  templateUrl: './tasks-details.component.html',
  styleUrl: './tasks-details.component.scss',
})
export class TasksDetailsComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'List', url: '/tasks/task-list' },
    { label: 'Task1', url: '/' },
  ];
  tabList: tabs[] = [
    { label: 'Subtasks', icon: 'pi pi-list' },
    { label: 'Task progress', icon: 'pi pi-chart-line' },
    { label: 'Comments', icon: 'pi pi-comments' },
    { label: 'Activity log', icon: 'pi pi-history' },
  ];
  tabCounts = [0, 0];
  currentTab: string = 'Subtasks';
  customClass: any = 'custom-class';
  sidebarVisible: boolean = false;
  progressSidebarVisible: boolean = false;
  taskId: any;
  taskData: any;
  authData: any;

  route = inject(ActivatedRoute);
  apiService = inject(AuthService);
  store = inject(Store);

  ngOnInit() {
    this.store.select(storedDetails).subscribe((data) => {
      this.authData = data;
      this.taskId = this.route.snapshot.params?.['id'];
      this.getTaskDetail(this.taskId);
    });
  }

  onTabChange(selectedTab: string) {
    this.currentTab = selectedTab;
  }
  addSubTask() {
    this.sidebarVisible = true;
  }
  updateProgress() {
    this.progressSidebarVisible = true;
  }
  columns: TableColumn[] = [
    { header: 'Task', field: 'task', isNested: false, sortKey: 'task', isNestedTree: true },
    { header: 'Assignee', field: 'assignee', isNested: false, sortKey: 'assignee' },
    { header: 'Status', field: 'status', statusField: true, sortKey: 'status' },
    {
      header: 'Due Date',
      field: 'dueDate',
      pipe: 'date',
      pipeParams: 'dd MMM yyyy',
      sortKey: 'dueDate',
    },
    { header: 'Priority', field: 'priority', isNested: false, sortKey: 'priority' },
    { header: 'Files', field: 'files', isNested: false },
    { header: 'Tags', field: 'tags', isNested: false },
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

  data: any[] = [
    {
      isExpandable: true,
      task: [
        {
          data: {
            label: 'T1',
            expanded: false,
          },

          children: [
            {
              data: {
                label: 'T2',
                expanded: false,
              },

              children: [
                {
                  data: {
                    label: 'T3',
                    expanded: false,
                  },
                  children: [
                    {
                      data: {
                        label: 'T4',
                        expanded: true,
                      },
                      children: [
                        {
                          data: {
                            label: 'T5',
                            expanded: false,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              data: {
                label: 'T2',
                expanded: false,
              },
              children: [
                {
                  data: {
                    label: 'T3',
                    expanded: false,
                  },
                },
              ],
            },
          ],
        },
      ],
      assignee: 'Rishabh Utekar',
      status: 'notStarted',
      dueDate: '2025-01-14',
      priority: 'medium',
      files: ['file1.png', 'file2.docx'],
      tags: ['ABC', 'Test'],
      summary: 'Create a design system for a hero section in 2 different variants.',
      isCancel: false,
    },
    {
      task: 'T3',
      isExpandable: false,
      assignee: 'Rishabh Utekar',
      status: 'inProcess',
      dueDate: '2025-01-14',
      priority: 'high',
      files: ['file3.pdf'],
      tags: ['ABC', 'Test'],
      summary: 'Create a simple presentation with a focus on typography.',
      isCancel: false,
    },
    {
      task: 'T4',
      isExpandable: false,
      assignee: 'Rishabh Utekar',
      status: 'inProcess',
      dueDate: '2025-01-14',
      priority: 'low',
      files: [],
      tags: ['ABC', 'Test'],
      summary: 'Work on a dashboard UI with dark mode support.',
      isCancel: false,
    },
    {
      task: 'T5',
      isExpandable: false,
      assignee: 'Rishabh Utekar',
      status: 'inProcess',
      dueDate: '2025-01-14',
      priority: 'medium',
      files: ['file4.jpg'],
      tags: ['ABC', 'Test'],
      summary: 'Design an e-commerce product page with interactive elements.',
      isCancel: false,
    },
    {
      task: 'T6',
      isExpandable: false,
      assignee: 'Rishabh Utekar',
      status: 'notStarted',
      dueDate: '2025-01-14',
      priority: 'high',
      files: [],
      tags: ['ABC', 'Test'],
      summary: 'Develop a wireframe for a fintech mobile app.',
      isCancel: false,
    },
    {
      task: 'T7',
      isExpandable: false,
      assignee: 'Rishabh Utekar',
      status: 'inProcess',
      dueDate: '2025-01-14',
      priority: 'low',
      files: ['file5.svg'],
      tags: ['ABC', 'Test'],
      summary: 'Create motion graphics for social media branding.',
      isCancel: false,
    },
    {
      task: 'T8',
      isExpandable: false,
      assignee: 'Rishabh Utekar',
      status: 'inProcess',
      dueDate: '2025-01-14',
      priority: 'medium',
      files: [],
      tags: ['ABC', 'Test'],
      summary: 'Redesign the homepage for a SaaS product website.',
      isCancel: false,
    },
    {
      task: 'T9',
      isExpandable: false,
      assignee: 'Rishabh Utekar',
      status: 'notStarted',
      dueDate: '2025-01-14',
      priority: 'low',
      files: ['file6.zip'],
      tags: ['ABC', 'Test'],
      summary: 'Explore color palette variations for branding guidelines.',
      isCancel: false,
    },
    {
      task: 'T10',
      isExpandable: false,
      assignee: 'Rishabh Utekar',
      status: 'completed',
      dueDate: '2025-01-14',
      priority: 'high',
      files: ['file7.png'],
      tags: ['ABC', 'Test'],
      summary: 'Prototype a mobile navigation system with gestures.',
      isCancel: false,
    },
  ];

  // Add/editMode of task
  isEdit: boolean = false;
  formDataOfEditTask: any = '';

  onAdditionOfTask(event: any) {
    this.sidebarVisible = false;
  }

  getTaskDetail(id: any) {
    let url = 'Task-Management/Task-Details_By_Mkey_NT';
    const body = {
      Mkey: +id,
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    this.apiService.postDetails(url, body, true).subscribe({
      next: (res) => {
        this.taskData = res[0]?.Data[0];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
