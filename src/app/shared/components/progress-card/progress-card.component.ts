import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { storedDetails } from '../../../store/auth/auth.selectors';
import { NotificationService } from '../../../services/notification.service';

export interface Data {
  title: string;
  description: string;
  status: 'inProcess' | 'notStarted' | 'completed';
  priority: 'low' | 'medium' | 'high';
  profileUrls: string[];
  progress: string;
  date: string;
  subTaskCount: number;
}

@Component({
  selector: 'app-progress-card',
  templateUrl: './progress-card.component.html',
  styleUrl: './progress-card.component.scss',
})
export class ProgressCardComponent {
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
      command: () => this.editItem(),
    },
  ];
  // need to remove this
  @Input() routePath!: string;

  @Input() data!: any;
  @Input() isLoading: boolean = false;
  @Output() onEdit = new EventEmitter();
  @Output() onViewDetails = new EventEmitter();
  constructor(
    private router: Router,
    private store: Store,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    console.log('check data: ', this.data)
    this.store.select(storedDetails).subscribe((data) => {
      this.authData = data;
    });
  }

  onCardClick() {
    this.onViewDetails.emit(this.data);
  }

  editItem() {
    if (this.data.Creator.trim() == this.authData.userName.trim()) {
      this.onEdit.emit(this.data);
    } else {
      this.notificationService.error("You don't have permission to perform this action");
    }
  }
}
