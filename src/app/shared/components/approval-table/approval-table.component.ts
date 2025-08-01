import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-approval-table',
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss'
})
export class ApprovalTableComponent implements OnInit {
  
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Output() rowChange = new EventEmitter<{ rowIndex: number, field: string, value: any }>();
  @Output() deleteRow = new EventEmitter<number>();


  ngOnInit(): void {
    console.log('Check the data: ', this.data);
  }

  clearFilter(dropdown: any) {
  dropdown.resetFilter(); // PrimeNG built-in method
}
  

}
