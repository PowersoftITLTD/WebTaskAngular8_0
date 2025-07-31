import { Component } from '@angular/core';
import { Data } from '../../../shared/components/progress-card/progress-card.component';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrl: './status-card.component.scss'
})
export class StatusCardComponent {
  projects = [
    { status: "Todays", value: 10 },
    { status: "Overdue", value: 1 },
    { status: "Not Started", value: 5 },
    { status: "Completed", value: 5 }
  ].map(project => ({
    ...project,
    value: project.value.toString().padStart(2, '0') // Adding leading zero
  }));
  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'badge-completed';
      case 'Todays':
        return 'badge-todays';
      case 'Overdue':
        return 'badge-overdue';
      case 'Not Started':
        return 'badge-not-started';
      default:
        return '';
    }
  }
  
}
