import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from '../../../shared/components/progress-card/progress-card.component';
import { tabs } from '../../../shared/components/tm-tabs/tm-tabs.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
  home: MenuItem | undefined;
  // tabs
    tabList: tabs[] = [
      { label: 'All'},
      { label: 'Approval'},
      { label: 'Compliance'},
      { label: 'Milestones'},
    ];
    tabCounts = [90, 50, 30, 10];
    currentTab: string = 'All';
  
    // Handle tab change event
    onTabChange(selectedTab: string) {
      this.currentTab = selectedTab;
    }
    dataList: any[] = [
      {
        Task_No: 'Short Description',
        Task_Description:
          'Create a design system for a hero section in 2 different variants. Create a simple designs that will create impact.',
        Status: 'inProcess',
        priority: 'high',
        profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
        progress: '60',
        Completion_Date: '19 Jan, 2025',
        subTaskCount: 1,
      },
      {
        Task_No: 'Short Description',
        Task_Description:
          'Create a design system for a hero section in 2 different variants. Create a simple designs that will create impact.',
        Status: 'inProcess',
        priority: 'high',
        profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
        progress: '60',
        Completion_Date: '19 Jan, 2025',
        subTaskCount: 1,
      },
      {
        Task_No: 'Short Description',
        Task_Description:
          'Create a design system for a hero section in 2 different variants. Create a simple designs that will create impact.',
        Status: 'inProcess',
        priority: 'high',
        profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
        progress: '60',
        Completion_Date: '19 Jan, 2025',
        subTaskCount: 1,
      },
      {
        Task_No: 'Short Description',
        Task_Description:
          'Create a design system for a hero section in 2 different variants. Create a simple designs that will create impact.',
        Status: 'inProcess',
        priority: 'high',
        profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
        progress: '60',
        Completion_Date: '19 Jan, 2025',
        subTaskCount: 1,
      },
    ];


  items:MenuItem[] = [
      { label: 'List', command: () => this.edit('List') },
      { label: 'Task 1', command: () => this.edit('Task 1') },
    ];
  projectData: Data | undefined;
  title: string = '';
  constructor(private router: Router) {
    this.projectData = this.router.getCurrentNavigation()?.extras.state?.['projectData'];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
  edit(param?: any) {
    if (param == 'List') {
      this.router.navigate(['/tasks','task-list'], { // Change to project-details
      });
    }
  }
}
