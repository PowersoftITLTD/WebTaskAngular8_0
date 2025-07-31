import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @Input() showDialog: boolean = false;
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttonLabel: string = '';
  @Input() isButtonLoading: boolean = false;
  @Input() type: 'warning' | 'confirm' = 'confirm';
  @Output() onConfirm = new EventEmitter<any>();
  @Output() onDialogHide = new EventEmitter<any>();
  @Input() icon: 'trash' | 'plane' | 'draft' | 'question_mark' = 'draft';
  @Input() isDisabled: boolean = false;

  onClick(event: Event) {
    this.onConfirm.emit(event);
  }

  onHide() {
    this.onDialogHide.emit();
  }
}
