import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-approval-table',
  templateUrl: './approval-table.component.html',
  styleUrl: './approval-table.component.scss'
})
export class ApprovalTableComponent implements OnInit,OnChanges  {
  
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Output() rowChange = new EventEmitter<{ rowIndex: number, field: string, value: any }>();
  @Output() deleteRow = new EventEmitter<number>();


  ngOnInit(): void {
    console.log('Check the data: ', this.data);
  }


   ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Data changed:', this.data);
    }
  }

selectDropdown(event: any): void {
  console.log('Full dropdown change event:', event);
  
}


  clearFilter(dropdown: any) {
  dropdown.resetFilter(); // PrimeNG built-in method
}

 trackByIndex(index: number, item: any): number {
    return index;
  }
  

}
