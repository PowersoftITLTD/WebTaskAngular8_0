import { Component } from '@angular/core';
import { tabs } from '../../../shared/components/tm-tabs/tm-tabs.component';
import { TableColumn } from '../../../shared/components/tm-table/tm-table.component';
import { Data } from '../../../shared/components/progress-card/progress-card.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss'
})
export class DocumentListComponent {
  tabList: tabs[] = [
      { label: 'List', icon: 'pi pi-list' },
      { label: 'Table', icon: 'pi pi-table' },
    ];
    tabCounts = [0, 0];
    currentTab: string = 'List';
    sidebarVisible: boolean = true;

    onTabChange(selectedTab: string) {
      this.currentTab = selectedTab;
    }
  addDocument() {
    this.sidebarVisible = true;
  }

   dataList: Data[] = [
      {
        title: 'Aadhar Card',
        description:
          'Category 1',
        status: 'inProcess',
        priority: 'high',
        profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
        progress: '60',
        date: '19 Jan, 2025',
        subTaskCount: 1,
      },
      {
        title: 'Aadhar Card',
        description:
          'Category 1',
        status: 'inProcess',
        priority: 'high',
        profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
        progress: '60',
        date: '19 Jan, 2025',
        subTaskCount: 1,
      },
      {
        title: 'Aadhar Card',
        description:
          'Category 1',
        status: 'notStarted',
        priority: 'medium',
        profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
        progress: '60',
        date: '19 Jan, 2025',
        subTaskCount: 2,
      },
      {
        title: 'Aadhar Card',
        description:
          'Category 1',
        status: 'completed',
        priority: 'low',
        profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
        progress: '60',
        date: '19 Jan, 2025',
        subTaskCount: 3,
      },
      {
        title: 'Aadhar Card',
        description:
          'Category 1',
        status: 'completed',
        priority: 'low',
        profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
        progress: '60',
        date: '19 Jan, 2025',
        subTaskCount: 3,
      },
      {
        title: 'Aadhar Card',
        description:
          'Category 1',
        status: 'completed',
        priority: 'low',
        profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
        progress: '60',
        date: '19 Jan, 2025',
        subTaskCount: 3,
      },
    ];
  
    columns: TableColumn[] = [
      { header: 'Task', field: 'task', isNested: false, sortKey: 'task' },
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
  
    data: any[] = [
      {
        task: 'T1',
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
}
