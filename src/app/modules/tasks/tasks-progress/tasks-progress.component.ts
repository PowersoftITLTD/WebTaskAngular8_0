import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks-progress',
  templateUrl: './tasks-progress.component.html',
  styleUrl: './tasks-progress.component.scss'
})
export class TasksProgressComponent {
  progressValue = 30;
}
