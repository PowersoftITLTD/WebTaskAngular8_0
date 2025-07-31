import { Component } from '@angular/core';

@Component({
  selector: 'app-task-detail-card',
  templateUrl: './task-detail-card.component.html',
  styleUrl: './task-detail-card.component.scss'
})
export class TaskDetailCardComponent {
  taskDetailCard = {
    title: 'Analyze the current onboarding process for the app and identify potential pain points',
    description: 'Analyze the current onboarding process for the app and identify potential pain points. Propose a revised onboarding flow that improves user retention and ensures a seamless experience for both new and returning users',
  };

  propertyDetails = [
    { icon: 'assets/rows-icon.svg', label: 'Category', value: 'Public' },
    { icon: 'assets/building-icon.svg', label: 'Building', value: 'Bay One' },
    { icon: 'assets/house-icon.svg', label: 'Property', value: 'Bay 1' },
  ];

  priority = { label: 'Medium', icon: 'assets/priorityMedium.svg' };
  assignees = [
    'assets/assignees1.png',
    'assets/assignees1.png',
    'assets/assignees1.png',
    'assets/assignees1.png',
  ];
  moreAssignees = 5;
  dueDate = '24 Jan, 2025';

  tags = ['ABC', 'ABC'];

  attachments = [
    { name: 'List.csv', icon: 'assets/xls.svg', downloadIcon: 'assets/download.svg' },
    { name: 'Notes.txt', icon: 'assets/txt.svg',  downloadIcon: 'assets/download.svg' },
    { name: 'Document.pdf', icon: 'assets/pdf.svg',  downloadIcon: 'assets/download.svg' },
  ];
  moreAttachments = 2;
}
