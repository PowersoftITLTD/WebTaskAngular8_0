import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-approval-table',
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss'
})
export class ApprovalTableComponent {
  
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Output() rowChange = new EventEmitter<{ rowIndex: number, field: string, value: any }>();
  @Output() deleteRow = new EventEmitter<number>();

}
