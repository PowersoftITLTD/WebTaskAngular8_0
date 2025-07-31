import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tm-advance-search',
  templateUrl: './tm-advance-search.component.html',
  styleUrl: './tm-advance-search.component.scss',
})
export class TmAdvanceSearchComponent {
  @Input() buttonLabel: string = '';
  @Input() showButton: boolean = true;
  @Output() onButtonClick = new EventEmitter<void>();
}
