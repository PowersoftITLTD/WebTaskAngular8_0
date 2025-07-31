import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-update-progress',
  templateUrl: './update-progress.component.html',
  styleUrl: './update-progress.component.scss',
})
export class UpdateProgressComponent {
  @Input() progressSidebarVisible: boolean = false;
  @Output() sidebarHide = new EventEmitter();

  onSidebarHide() {
    this.sidebarHide.emit();
  }
  progressValue: number = 30; 

  // Method to update progress value dynamically
  updateProgress(value: number) {
    this.progressValue = value;
  }
  comment: string = '';
  comments = [
    {
      author: 'Pooja Kumhar',
      time: '23 hrs ago',
      mention: 'Dhanashree',
      text: 'Cool will check and mark status',
      avatar: 'assets/assignees1.png',
    },
    {
      author: 'Dhanashri Patil',
      time: '24 hrs ago',
      mention: 'Pooja',
      text: 'Hey, yes those were completed yesterday',
      avatar: 'assets/assignees1.png',
    },
    {
      author: 'Pooja Kumhar',
      time: '1 Day ago',
      mention: 'Dhanashree',
      text: 'Hii, are the tasks completed?',
      avatar: 'assets/assignees1.png',
    },
  ];
}
