import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrl: './approval-list.component.scss'
})
export class ApprovalListComponent {

     sidebarVisible: boolean = false;

   constructor(private router: Router){}

    home: MenuItem | undefined;  
    currentTab: string = 'All';

   onTabChange(selectedTab: string) {
      this.currentTab = selectedTab;
   }

    items:MenuItem[] = [
      { label: 'List', command: () => this.edit('List') },
      { label: 'Task 1', command: () => this.edit('Task 1') },
    ];

      edit(param?: any) {
    if (param == 'List') {
      this.router.navigate(['/tasks','task-list'], { // Change to project-details
      });
    }
  }

   addApproval() {
    this.sidebarVisible = true;
    //console.log('this.sidebarVisible: ', this.sidebarVisible);
  }

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
