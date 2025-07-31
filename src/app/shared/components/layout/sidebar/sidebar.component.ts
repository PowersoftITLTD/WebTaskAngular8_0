import { Component } from '@angular/core';

interface Menu {
  label: string;
  icon: string;
  hasAccess?: any;
  routerLink?: string | null;
  children?: any;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuItems: Menu[] = [
    {
      label: 'Dashboard',
      icon: 'assets/dashboard-icon/dashboard-icon.svg',
      routerLink: null,
      hasAccess: true,
    },
    {
      label: 'Tasks',
      icon: 'assets/tasks.svg',
      routerLink: '/tasks',
      hasAccess: true,
    },
    {
      label: 'Templates',
      icon: 'assets/templates.svg',
      hasAccess: true,
      children: [
        {
          label: 'Template',
          icon: 'assets/dashboard-icon/dashboard-icon.svg',
          routerLink: 'template',
          hasAccess: true,
        },
        {
          label: 'User Creation',
          icon: 'assets/dashboard-icon/dashboard-icon.svg',
          routerLink: 'user',
          hasAccess: true,
        },
        {
          label: 'Roles Creation',
          icon: 'assets/dashboard-icon/dashboard-icon.svg',
          routerLink:'role',
          hasAccess: true,
        },
        {
          label: 'Type Master',
          icon: 'assets/dashboard-icon/dashboard-icon.svg',
          routerLink: null,
          hasAccess: true,
        },
      ],
    },
    {
      label: 'Projects',
      icon: 'assets/projects.svg',
      hasAccess: true,
      children: [
        {
          label: 'Project Definition',
          icon: 'assets/dashboard-icon/dashboard-icon.svg',
          routerLink: 'project',
          hasAccess: true,
        },
        {
          label: 'Document Depository',
          icon: 'assets/dashboard-icon/dashboard-icon.svg',
          routerLink: 'document',
          hasAccess: true,
        },
        {
          label: 'Compliance',
          icon: 'assets/dashboard-icon/dashboard-icon.svg',
          routerLink: 'compliance',
          hasAccess: true,
        },
      ],
    },
  ];
}
