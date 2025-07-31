import { Component } from '@angular/core';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.scss'
})
export class PropertyCardComponent {
  property = {
    name: 'Hubtown',
    building: 'SHS SOT',
    address: 'Flat No. 12, A-Wing, Sunshine Apartments, Bandra West Mumbai, Maharashtra, 400050'
  };
  projectName = "Project Abbr.";
  propertyDetails = [
    { icon: 'assets/building-icon.svg', label: 'Building Type', value: 'Mall' },
    { icon: 'assets/house-icon.svg', label: 'Building Standard', value: '15 storey' },
    { icon: 'assets/rows-icon.svg', label: 'Statutory Authority', value: 'BMC' },
    { icon: 'assets/rows-icon.svg', label: 'Legal Entity', value: 'ABCD' }
  ];
}
