import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tm-edit',
  templateUrl: './tm-edit.component.html',
  styleUrl: './tm-edit.component.scss'
})
export class TmEditComponent {
  @Input() buttonLabel: string = '';
  @Input() showButton: boolean = true;
}
