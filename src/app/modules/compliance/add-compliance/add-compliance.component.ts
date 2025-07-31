import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-compliance',
  templateUrl: './add-compliance.component.html',
  styleUrl: './add-compliance.component.scss'
})
export class AddComplianceComponent {
 @Input() sidebarVisible: boolean = false;
  @Output() sidebarHide = new EventEmitter();

  onSidebarHide() {
    this.sidebarHide.emit();
  }

  onCancel() {
    this.sidebarVisible = false;
  }

  onCreate() {
    this.sidebarVisible = false;
  }
  property = [
    { label: 'Hubtown countrywood', value: 'Hubtown countrywood' },
    { label: 'Other Property', value: 'Other Property' },
  ];

  buildings = [
    { label: 'KONDWA NANO - BLDG R', value: 'KONDWA NANO - BLDG R' },
    { label: 'Other Building', value: 'Other Building' },
  ];

  documents = [
    { label: 'Task 1', value: 'Task 1' },
    { label: 'Task 2', value: 'Task 2' },
  ];
  // Dropdowns
  properties = [
    { name: 'New York' },
    { name: 'Rome' },
    { name: 'London' },
    { name: 'Istanbul' },
    { name: 'Paris' },
  ];
  priorityList = [
    { name: 'High', color: '#d92d20' },
    { name: 'Medium', color: '#f79009' },
    { name: 'Low', color: '#027a48' },
  ];
  selectedProperty: any;
  selectedBuilding: any;
  selectedAssignee: any;
  selectedCategory: any;
  selectedType: any;
  selectedTag: any;
  selectedPriority: any;

  showCheckList: boolean = false;
  showOutcome: boolean = false;
  showAuthority: boolean = false;

  // Calendar
  numberOfDays: number = 0;
  selectedDate: Date | null = null;
  selectedCompletionDate: Date | null = null;
  todayDate = new Date();

  tentativeStartDate: Date | null = null;
  tentativeEndDate: Date | null = null;
  actualStartDate: Date | null = null;
  actualEndDate: Date | null = null;

  updateCalendar() {
    if (this.numberOfDays !== null && this.numberOfDays >= 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
      this.selectedDate = new Date(today);
      this.selectedDate.setDate(today.getDate() + this.numberOfDays);
    }
  }

  updateDays() {
    if (this.selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today’s date
      const selected = new Date(this.selectedDate);
      selected.setHours(0, 0, 0, 0); // Normalize selected date

      const diffTime = selected.getTime() - today.getTime();
      this.numberOfDays = diffTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    }
  }

  resetValues() {
    this.numberOfDays = 0;
    this.selectedDate = new Date(); // Reset to today’s date
    this.selectedCompletionDate = null;
  }

  confirmSelection() {
    this.selectedCompletionDate = this.selectedDate;
  }

  // Authority
  // Table column definitions
  authorityTableColumns: any = [
    { header: 'Level', field: 'level' },
    { header: 'Sanctioning Department  ', field: 'sanctioningDepartment' },
    { header: 'Sanctioning Authority', field: 'sanctioningAuthority' },
    { header: 'Mode', isSwitch: true },
    { header: '', isAction: true },
  ];
  authorityTableData = [
    { level: 1, sanctioningDepartment: 'Dep 1', sanctioningAuthority: 'A 1', isActive: true },
    { level: 2, sanctioningDepartment: 'Dep 2', sanctioningAuthority: 'A 2', isActive: false },
  ];

  // Checklist
  searchQuery: string = '';

  categories = [
    {
      name: 'Land Related',
      items: [
        { name: '7/12 utara', selected: false },
        { name: 'Deed', selected: true },
        { name: 'Land Doc Test Name', selected: false },
        { name: 'TP Remark', selected: false },
      ],
    },
    { name: "Form NOC's", items: [] },
    { name: 'CFO RTT TEST 1', items: [] },
    { name: 'ABC 56', items: [] },
    { name: 'Others', items: [] },
  ];

  // checklist
  checkListTableColumns = [
    { header: 'Sr No', field: 'srNo' },
    { header: 'Document Category', field: 'documentCategory' },
    { header: 'Document Name', field: 'documentName' },
  ];
  checkListTableData = [{ srNo: 1, documentCategory: 'Land Related', documentName: 'Deed' }];
}
