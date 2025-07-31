import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-new-project',
  templateUrl: './add-new-project.component.html',
  styleUrls: ['./add-new-project.component.scss']
})
export class AddNewProjectComponent {
   @Input() sidebarVisible: boolean = false;
    @Output() sidebarHide = new EventEmitter();

    onSidebarHide() {
      this.sidebarHide.emit();
    }
    // addWork() {
    //   this.sidebarVisible = true;
    //   console.log('Coming form the project: ', this.sidebarVisible);
    // }
    onCreate() {
      this.sidebarVisible = false;
    }
  projectForm: FormGroup;
  properties = [
    { label: 'Hubtown', value: 'Hubtown' },
    { label: 'Other Property', value: 'Other Property' }
  ];

  buildings = [
    { label: 'SHS SOT', value: 'SHS SOT' },
    { label: 'Other Building', value: 'Other Building' }
  ];

  legalEntities = [
    { label: 'ABCD', value: 'ABCD' },
    { label: 'Other Entity', value: 'Other Entity' }
  ];

  buildingTypes = [
    { label: 'Mall', value: 'Mall' },
    { label: 'Office', value: 'Office' },
    { label: 'Residential', value: 'Residential' }
  ];

  buildingStandards = [
    { label: '15 storey', value: '15 storey' },
    { label: '20 storey', value: '20 storey' }
  ];

  statutoryAuthorities = [
    { label: 'BMC', value: 'BMC' },
    { label: 'Other Authority', value: 'Other Authority' }
  ];

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      property: [this.properties[0].value],
      building: [this.buildings[0].value],
      legalEntity: [this.legalEntities[0].value],
      projectAddress: ['Flat No. 12, A-Wing, Sunshine Apartments, Bandra West Mumbai, Maharashtra, 400050'],
      projectAbbreviation: ['ABCD'],
      buildingType: [this.buildingTypes[0].value],
      buildingStandard: [this.buildingStandards[0].value],
      statutoryAuthority: [this.statutoryAuthorities[0].value]
    });
  }

  onCancel() {
    this.sidebarVisible = false;
  }

  onAdd() {
    console.log('Project added', this.projectForm.value);
  }
}
