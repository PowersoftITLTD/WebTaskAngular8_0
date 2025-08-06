import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-approval-authority-table',
  templateUrl: './approval-authority-table.component.html',
  styleUrl: './approval-authority-table.component.scss'
})

export class ApprovalAuthorityTableComponent implements OnInit, OnChanges {

  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() selectable: boolean = false;
  @Input() status: boolean = false;

  ngOnInit(){


    console.log('data: ', this.data)
  }

    ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      console.log('Data changed:', this.data);
    }
  }

  

}
