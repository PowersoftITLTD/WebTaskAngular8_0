import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface tabs {
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-tm-tabs',
  templateUrl: './tm-tabs.component.html',
  styleUrl: './tm-tabs.component.scss',
})
export class TmTabsComponent {
  @Input() tabs: tabs[] = [];
  @Input() counts: number[] = [];
  @Input() showCount: boolean = false;
  @Output() tabChanged = new EventEmitter<string>();

  @Input() activeTab!: string;

  constructor() {}

  selectTab(tab: tabs): void {
    this.activeTab = tab.label;
    this.tabChanged.emit(tab.label);
  }
}
