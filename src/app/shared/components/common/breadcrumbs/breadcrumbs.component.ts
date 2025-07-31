import { Component, Input } from '@angular/core';

interface BreadcrumbItem {
  label: string;
  url: string;
  queryParam?: string;
}
@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent {
  @Input() breadcrumbItems: BreadcrumbItem[] = [];
}
