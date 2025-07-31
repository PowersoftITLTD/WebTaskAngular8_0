import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { InputSwitchChangeEvent } from 'primeng/inputswitch';

export interface TableColumn {
  header: string;
  field?: string;
  pipe?: string;
  pipeParams?: any;
  isNested?: boolean;
  nestedFields?: string[];
  isAction?: boolean;
  statusField?: boolean;
  sortKey?: string;
  isSwitch?: boolean;
  actionButton?: boolean;
  isNestedTree?: boolean; // Check whether the column has a nested Tree structure
  isColumnVisible?: boolean;
}

@Component({
  selector: 'app-tm-table',
  templateUrl: './tm-table.component.html',
  styleUrl: './tm-table.component.scss',
  providers: [DatePipe],
})
export class TmTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() selectable: boolean = false;
  @Input() status: boolean = false;
  @Input() customClassValue: any = '';
  @Input() nestedColumns: TableColumn[] = []; //It will have details of expandable tree columns and their binded variables
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() onViewDetails = new EventEmitter<any[]>();
  @Input() loading: boolean = false;
  @Output() onSortChange = new EventEmitter<any>();
  @Input() customAction: any[] | undefined;
  @Output() onSelect = new EventEmitter<any>();
  @Output() onToggleSwitch = new EventEmitter<any>();

  allSelected = false;
  indeterminate = false;
  selectedItem: any;

  currentSortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  actions: any = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.editItem(),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.deleteItem(),
    },
  ];

  constructor(private datePipe: DatePipe) {}

  applyPipe(value: any, pipe?: string, pipeParams?: any): any {
    if (!pipe) {
      return value;
    }

    if (pipe === 'date' && this.isDate(value)) {
      return this.datePipe.transform(value, pipeParams);
    }

    return value;
  }

  isDate(value: any): boolean {
    return value instanceof Date || (!isNaN(Date.parse(value)) && typeof value === 'string');
  }

  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.allSelected = checked;
    this.indeterminate = false;
    this.data.forEach((item) => {
      if (item?.isCancel) return;
      item.selected = checked;
    });
    this.emitSelectedItems(); // Emit selected items
  }

  updateSelection(): void {
    const selectedItems = this.data.filter((item) => item.selected);
    this.allSelected = selectedItems.length === this.data.length;
    this.indeterminate = selectedItems.length > 0 && selectedItems.length < this.data.length;
    this.emitSelectedItems(); // Emit selected items
  }

  emitSelectedItems(): void {
    const selectedItems = this.data.filter((item) => item.selected && !item?.isCancel);
    this.selectionChange.emit(selectedItems); // Emit the selected items
  }

  editItem() {
    this.onEdit.emit(this.selectedItem);
  }

  deleteItem() {
    this.onDelete.emit(this.selectedItem);
  }

  viewDetails(item: any) {
    this.onViewDetails.emit(item);
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    switch (status) {
      case 'notStarted':
        return 'notStarted status';
      case 'inProcess':
        return 'inProcess status';
      case 'completed':
        return 'completed status';
      default:
        return ''; // Default class or no class
    }
  }

  sortBy(field: string | undefined) {
    if (!field) return;
    if (this.currentSortField === field) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // update field and reset direction to ascending
      this.currentSortField = field;
      this.sortDirection = 'asc';
    }

    this.onSortChange.emit({
      SortBy: this.currentSortField,
      SortOrder: this.sortDirection,
    });
  }

  clearAllCheckbox(): void {
    this.allSelected = false;
    this.indeterminate = false;
    this.data.forEach((item) => (item.selected = false));
    this.emitSelectedItems();
  }

  emitSelectedItem(item: any) {
    this.onSelect.emit(item);
  }

  toggleSwitch(event: InputSwitchChangeEvent, item: any) {
    this.onToggleSwitch.emit({
      checked: event.checked,
      item: item,
    });
  }
}
