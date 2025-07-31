import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { Data } from '../../../shared/components/progress-card/progress-card.component';
import { NotificationService } from '../../../services/notification.service';
import { Store } from '@ngrx/store';
import { storedDetails } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-tasks-board',
  templateUrl: './tasks-board.component.html',
  styleUrl: './tasks-board.component.scss',
})
export class TasksBoardComponent {
  @Input() data: Data[] = [];
  @Output() onEdit = new EventEmitter();
  @Output() onViewDetails = new EventEmitter();

  taskData: Data[] = [];
  selectedTask: any;

  notificationService = inject(NotificationService);
  store = inject(Store);
  authData: any;

  actions: any = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.editItem(),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
    },
  ];

  ngOnInit() {
    this.store.select(storedDetails).subscribe((data) => {
      this.authData = data;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.taskData = structuredClone(this.data);
      const statusOrder = ['Not Started', 'In Progress', 'Completed'];
      this.taskData.sort(
        (a: any, b: any) =>
          statusOrder.indexOf(a.Dashboard_Status) - statusOrder.indexOf(b.Dashboard_Status),
      );
    }
  }

  showActionBtn(event: any, task: any) {
    event.stopPropagation();
    this.selectedTask = task;
  }

  editItem() {
    if (this.selectedTask.Creator.trim() == this.authData.userName.trim()) {
      this.onEdit.emit(this.selectedTask);
    } else {
      this.notificationService.error("You don't have permission to perform this action");
    }
  }

  onCardClick(task: any) {
    this.onViewDetails.emit(task);
  }
}
