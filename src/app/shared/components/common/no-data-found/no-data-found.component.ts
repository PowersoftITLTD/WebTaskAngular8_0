import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-no-data-found',
  templateUrl: './no-data-found.component.html',
  styleUrl: './no-data-found.component.scss',
})
export class NoDataFoundComponent {
  @Input() title: string = '';
  @Input() buttonLabel: string = '';
  @Input() buttonIcon: string = '';

  @Output() onClick = new EventEmitter<any>();

  handleClick(event: Event) {
    this.onClick.emit(event);
  }
}
