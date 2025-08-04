import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { MultiSelect } from 'primeng/multiselect';
import { AuthService } from '../../../services/auth/auth.service';
import { catchError, forkJoin, Observable, of, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { storedDetails } from '../../../store/auth/auth.selectors';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-add-approval',
  templateUrl: './add-approval.component.html',
  styleUrl: './add-approval.component.scss'
})
export class AddApprovalComponent {

  @Input() sidebarVisible: boolean = false;
  @Output() sidebarHide = new EventEmitter();

  authData: any;
  selectedAssignedPeopleLabel: any;

  building: any = [];
  standard: any = [];
  authority: any = [];

  getRelAbbr: any[] = [];

  tagsList: any[] = [];
  selectedTag: any[] = [];

  tempCheckListCategories: any = [];
  tempCheckListTableData: any = [];
  tempOutcomeTableData: any = [];
  tempOutcomeCategories: any = [];
  assignedPeopleList: any[] = [];

  authorityTableData: any[] = [];



  private isCheckValueCalled: boolean = false;

  notificationService = inject(NotificationService);

  outcomeCategories: any = [];
  outcomeTableData: any = [];

  checkListCategories: any = [];
  department: any = [];
  jobRole: any = [];

  activePanel: 'checklist' | 'outcome' | null = null;


  // Dropdowns
  // properties = [
  //   { name: 'New York' },
  //   { name: 'Rome' },
  //   { name: 'London' },
  //   { name: 'Istanbul' },
  //   { name: 'Paris' },
  // ];
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
  selectedPriority: any;

  showCheckList: boolean = false;
  showOutcome: boolean = false;
  showAuthority: boolean = false;
  showSubTaskList: boolean = false;

  // Calendar
  numberOfDays: number = 0;
  selectedDate: Date | null = null;
  selectedCompletionDate: Date | null = null;
  todayDate = new Date();

  tentativeStartDate: Date | null = null;
  tentativeEndDate: Date | null = null;
  actualStartDate: Date | null = null;
  actualEndDate: Date | null = null;
  @Input() isEditMode: boolean = false;
  @Input() formData: any;
  @ViewChild('multiSelect') multiSelect!: MultiSelect;
  @Input() isSubTask: boolean = false;
  @Input() parentTaskData: any;

  onSidebarHide() {
    this.sidebarHide.emit();
  }
  addWork() {
    this.sidebarVisible = true;
  }
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

  constructor(private fb: FormBuilder,
    private apiService: AuthService,
    private store: Store,
    private spinner: NgxSpinnerService
  ) {
    this.projectForm = this.fb.group({

      projectAbbreviation: ['ABCD'],

      buildingType: [this.buildingTypes[0].value],

      Assigned_To: [],

      longDescription: [],
      shortDescription: [],

      standard: [],
      authority: [],
      building: [],

      jobRole: [],
      department: [],

      noOfDays: [this.legalEntities[0].value],
      sequenceNo: [],

      tags: [''],

      rows: this.fb.array([], [this.duplicateAbbrivationValidator()]),
      rows_new: this.fb.array([])
    });
  }


  ngOnInit() {
    this.store.select(storedDetails).pipe(take(1)).subscribe((data) => {
      this.authData = data;
      console.log('Auth Data:', this.authData);

      if (this.isEditMode) {
        this.spinner.show();
      }

      forkJoin([
        this.getDocumentType(),
        this.getDocumentTypeEndlist(),
        this.getDepartmentList(),
        this.jobRoleList(),
        this.getAssignedPeopleDetails(),
        this.getBuilding(),
        this.getBuildingStandard(),
        this.statutoryAuthority(),
        this.getTagsList(),
      ]).subscribe({
        next: () => {
          if (this.isEditMode) {
            this.patchForm();
            this.spinner.hide();
          }
          // Consider resetting the form *after* patching if needed
          this.resetFormValues();
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error fetching dropdown data:', err);
        },
      });
    });



    // this.initForm();
    this.resetFormValues();
    //this.onSelectOfAssignedPeople();

  }



  duplicateAbbrivationValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const seenAbbrivation = new Set<string>();

      for (const rowControl of formArray.controls) {
        const abbrivation = rowControl.get('abbrivation')?.value;
        if (abbrivation && seenAbbrivation.has(abbrivation)) {
          return { duplicateAbbrivation: true };
        }
        seenAbbrivation.add(abbrivation);
      }
      return null;
    };
  }


  //   addRow() {
  //     console.log("Add row clicked");

  //     const newRow = {
  //       abbrivation: 'asd',
  //       shorT_DESCRIPTION: 'asd',
  //       sanctioN_DEPARTMENT: 'asd',
  //       nO_DAYS_REQUIRED: 'asd',
  //       authoritY_DEPARTMENT: 'asd',
  //       enD_RESULT_DOC: 'asd',
  //       subtasK_MKEY: 'asd',
  //       subTaskTags: 'asd',
  //       sequentialNo: this.authorityTableData.length + 1
  //     };

  //     // IMPORTANT: Use spread operator to trigger change detection
  //     this.authorityTableData = [...this.authorityTableData, newRow];
  //     console.log('AuthorityTableData: ',this.authorityTableData)
  // }


  addRow(savedData?: any) {
    const buildingType = this.projectForm.get('building')?.value;
    const buildingStandard = this.projectForm.get('standard')?.value;
    const statutoryAuthority = this.projectForm.get('authority')?.value;



    const body = {
      Building: this.projectForm.get('building')?.value,
      Standard: this.projectForm.get('standard')?.value,
      Authority: this.projectForm.get('authority')?.value,
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    }

    //console.log('body: ', body);

    if (buildingType && buildingStandard && statutoryAuthority) {
      // this.recursiveLogginUser = this.apiService.getRecursiveUser();

      const url = 'Approval-Template-Get-Abbr-And-ShortAbbr-NT'

      // API call to fetch abbreviation and other data
      this.apiService.postDetails(url, body, false, false, true).subscribe({
        next: (gerAbbrRelData) => {
          // this.checkValue(gerAbbrRelData); // Call checkValue to process the first time

         // console.log('gerAbbrRelData: ',gerAbbrRelData);
         // console.log('authorityTableColumns: ', this.authorityTableColumns);
         // gerAbbrRelData

          
          this.getRelAbbr = Array.isArray(gerAbbrRelData) ? gerAbbrRelData : [gerAbbrRelData];

        

          if (this.getRelAbbr.length === 0) {
            //this.tostar.error("Details of this combination is empty or missing");
            return;
          }

          const rows: FormArray = this.projectForm.get('rows') as FormArray;



          const tagsValue = rows.get('subTaskTags')?.value || [];
          let tagsString: string = '';

          if (Array.isArray(tagsValue)) {
            tagsString = tagsValue.map(tag => {
              if (typeof tag === 'string') {
                return tag;
              } else if (tag.display) {
                return tag.display;
              } else {
                return '';
              }
            }).join(',');
          }

          // console.log('tagsString from row', tagsString);

          // Create a new row with the necessary controls
          const newRow = this.fb.group({
            abbrivation: ['abbrivation', Validators.required],
            shorT_DESCRIPTION: ['Short desctiption'],
            sanctioN_DEPARTMENT: ['Sanction Department'],
            nO_DAYS_REQUIRED: ['No of days'],
            authoritY_DEPARTMENT: ['Authority department'],
            enD_RESULT_DOC: ['End Result documents'],
            subtasK_MKEY: ['Test 1'],
            subTaskTags: [tagsString],
            sequentialNo: [rows.length + 1],
          });

          rows.push(newRow);


          const data = gerAbbrRelData.value[0]?.Data;

        console.log('data newRow.value: ', data)

        // Step 1: Build unique Abbreviation options
          const abbrOptions = Array.from(
            new Map(
              data.map((item:any) => [item.Main_Abbr, { 
                ...item,
                label: item.Main_Abbr, value: item.Main_Abbr 
              }])
            ).values()
          );

          console.log('abbrOptions: ', abbrOptions)

          // Step 2: Build unique Short Description options
          const shortDescOptions = Array.from(
            new Map(
              data.map((item:any) =>
                //console.log('Short description: ',item)
                [item.Short_Description?.trim(), {
                label: item.Short_Description?.trim(),
                value:item.Short_Description?.trim(),
                ...item
              }]
            )
            ).values()
          );

          console.log('shortDescOptions from add-approval: ', shortDescOptions)

          // Step 3: Update authorityTableColumns
          this.authorityTableColumns = this.authorityTableColumns.map((column:any) => {
            if (column.field === 'abbrivation') {
              return { ...column, options: abbrOptions };
            }
            if (column.field === 'shorT_DESCRIPTION') {
              return { ...column, options: shortDescOptions };
            }
            return column;
          });

          console.log('this.authorityTableColumns from add-approval', this.authorityTableColumns )

          this.authorityTableData = [...this.authorityTableData, newRow.value];

          console.log('AuthorityTableData: ', this.authorityTableData)

          if (!this.isCheckValueCalled) {
            this.isCheckValueCalled = true;
          } else {
            //this.checkValueForNewRow(newRow);
          }
        },
        error: (err) => {
          this.notificationService.error('Unable to fetch data, please check internet connection');
          // this.tostar.error('Unable to fetch data, please check internet connection');
        }
      });
    } else {
      this.notificationService.error('Please select all classification');

      return;
    }
  }

  //  onTableRowChange(event: { rowIndex: number, field: string, value: any }) {

  //   console.log('Check the event: ',event)
  //   const { rowIndex, field, value } = event;
  //   this.authorityTableData[rowIndex][field] = value;

  //   // console.log('authorityTableData: ',this.authorityTableData)
  //   // console.log('field: ', field)

  //   if (field === 'abbrivation') {  
      
  //     console.log('this.authorityTableData[rowIndex][field]: ', this.authorityTableData[rowIndex][field]);
  //     console.log('this.getRelAbbr ', this.getRelAbbr[0].value[0].Data)

  //     const selected = this.getRelAbbr[0].value[0].Data.find((item:any) => item.Main_Abbr === value);
  //     console.log('Selected value: ',selected);
  //     if (selected) {

  //          const rows: FormArray = this.projectForm.get('rows') as FormArray;
           
  //          const newRow = this.fb.group({
  //           abbrivation: [selected.Main_Abbr],
  //           shorT_DESCRIPTION: [],
  //           sanctioN_DEPARTMENT: [],
  //           nO_DAYS_REQUIRED: [],
  //           authoritY_DEPARTMENT: [],
  //           enD_RESULT_DOC: [],
  //           subtasK_MKEY: ['Test 1'],
  //           subTaskTags: [''],
  //           sequentialNo: [rows.length + 1],
  //         });

  //         rows.push(newRow);

  //       // this.authorityTableData[rowIndex].shortDescription = selected.shorT_DESCRIPTION;
  //       // this.authorityTableData[rowIndex].daysRequired = selected.nO_DAYS_REQUIRED;
  //       // this.authorityTableData[rowIndex].authorityDept = selected.sanctioN_DEPARTMENT;
  //       // this.authorityTableData[rowIndex].endResult = selected.enD_RESULT_DOC;
  //     }
  //   }
  // }

  onTableRowChange(event: { rowIndex: number, field: string, value: any }) {
  const { rowIndex, field, value } = event;

  // Update the field in authorityTableData
  this.authorityTableData[rowIndex][field] = value;

  console.log('field: ', field);
  console.log('value: ', value);

  if (field === 'abbrivation' || field === 'shorT_DESCRIPTION') {
    const matchedItem = this.getRelAbbr[0]?.value[0]?.Data.find((item: any) => item.Main_Abbr === value) || this.getRelAbbr[0]?.value[0]?.Data.find((item: any) => item.Short_Description.trim() === value);
    console.log('matchedItem: ', matchedItem);
    console.log('Department: ', this.department);

       const matchedDepartment = this.department.find((department:any) => department.Mkey === matchedItem?.Authority_Department);

    console.log('matchedDepartment: ',matchedDepartment);
    console.log('matchedItem: ', matchedItem);
    if (matchedDepartment) {
        matchedItem.Authority_Dept = matchedDepartment.Department_Type;
    } else {
        console.log("Department not found");
    }
    if (matchedItem) {
      // Update the authorityTableData row with new values
      this.authorityTableData[rowIndex] = {
        ...this.authorityTableData[rowIndex],
        abbrivation: matchedItem.Main_Abbr,
        shorT_DESCRIPTION: matchedItem.Short_Description,
        sanctioN_DEPARTMENT: matchedItem.Authority_Department,
        nO_DAYS_REQUIRED: matchedItem.Days_Requierd,
        authoritY_DEPARTMENT:  matchedItem.Authority_Dept,
        enD_RESULT_DOC: matchedItem.End_Result_Doc,
      };

      // Update the FormArray row too
      const rows = this.projectForm.get('rows') as FormArray;
      const targetRow = rows.at(rowIndex) as FormGroup;

      targetRow.patchValue({
        abbrivation: matchedItem.Main_Abbr,
        shorT_DESCRIPTION: matchedItem.Short_Description,
        sanctioN_DEPARTMENT: matchedItem.Authority_Department,
        nO_DAYS_REQUIRED: matchedItem.Days_Requierd,
        authoritY_DEPARTMENT:  matchedItem.Authority_Dept,
        enD_RESULT_DOC: matchedItem.End_Result_Doc,
      });
    }
  }
}


  onAbbrChange(event: Event, rowForm: FormGroup, rowIndex?: number | any) {
    const selectElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    const selectedAbbr = selectElement.value; // Now TypeScript knows 'value' exists

    //console.log('selectedAbbr', selectedAbbr)
    rowForm.get('abbrivation')?.setValue(selectedAbbr);

    const selectedRow = this.getRelAbbr.find(r => r.maiN_ABBR === selectedAbbr);
    console.log('selectedRow: ', rowForm);
    const header_no_of_days = Number(this.projectForm.get('noOfDays')?.value);
    const subtas_no_of_days = selectedRow?.dayS_REQUIERD || 0;

    const formArray = this.projectForm.get('rows') as FormArray;

    // Calculate total days required across all rows
    let totalDaysRequired = formArray.controls.reduce((sum, row) => {
      return sum + (row.get('nO_DAYS_REQUIRED')?.value || 0);
    }, 0);

    totalDaysRequired += subtas_no_of_days; // Add newly selected row's days

    console.log('Total Days Required: ', totalDaysRequired);
    console.log('header_no_of_days: ', header_no_of_days)

    if (totalDaysRequired >= header_no_of_days) {
      if (!confirm(`Days are exceeding as per header which is ${header_no_of_days} Days. Do you still want to proceed?`)) {
        formArray.removeAt(formArray.length - 1); // Remove the last added row
        return;
      }
    }

    const abbrivation = this.projectForm.get('abbr')?.value;



    if (abbrivation === selectedAbbr) {
      this.notificationService.error('Same approval cannot assign to itself');
      formArray.removeAt(formArray.length - 1); // Remove the last added row
      return;
    } else if (abbrivation === '' || abbrivation === undefined || abbrivation === null) {
      this.notificationService.error('Please enter the approval header abbrivation');
      formArray.removeAt(formArray.length - 1); // Remove the last added row
      return;
    }

    console.log('ROW form: ', formArray.value)

    const sublist_form_value = formArray.value

    const abbrivationSet = new Set();
    let hasDuplicate = false;

    sublist_form_value.forEach((val: any) => {
      if (abbrivationSet.has(val.abbrivation)) {
        hasDuplicate = true;
      } else {
        abbrivationSet.add(val.abbrivation);
      }
    });

    if (hasDuplicate) {
      this.notificationService.error("Record already exist");
      formArray.removeAt(formArray.length - 1); // Remove the last added row
      return;
    }

    const matchedDepartment = this.department.find((department: any) => department.mkey === selectedRow?.authoritY_DEPARTMENT);

    console.log('matchedDepartment: ', matchedDepartment)
    if (matchedDepartment) {
      selectedRow.sanctioN_DEPARTMENT = matchedDepartment.typE_DESC;
    } else {
      console.log("Department not found");
    }

    if (selectedRow) {
      rowForm.get('selectedAbbr')?.setValue(selectedRow.maiN_ABBR);
      rowForm.get('shorT_DESCRIPTION')?.setValue(selectedRow.shorT_DESCRIPTION);
      rowForm.get('sanctioN_DEPARTMENT')?.setValue(selectedRow.sanctioN_DEPARTMENT);
      rowForm.get('nO_DAYS_REQUIRED')?.setValue(selectedRow.dayS_REQUIERD);
      rowForm.get('enD_RESULT_DOC')?.setValue(selectedRow.enD_RESULT_DOC);
      rowForm.get('authoritY_DEPARTMENT')?.setValue(selectedRow.abbR_SHORT_DESC);
      rowForm.get('subtasK_MKEY')?.setValue(selectedRow.mkey);
      rowForm.get('SUBTASK_TAGS')?.setValue(selectedRow.subTaskTags);
    } else {
      rowForm.get('selectedAbbr')?.setValue('');
      rowForm.get('shorT_DESCRIPTION')?.setValue('');
      rowForm.get('sanctioN_DEPARTMENT')?.setValue('');
      rowForm.get('nO_DAYS_REQUIRED')?.setValue('');
      rowForm.get('enD_RESULT_DOC')?.setValue('');
      rowForm.get('authoritY_DEPARTMENT')?.setValue('');
      rowForm.get('subtasK_MKEY')?.setValue('');
      rowForm.get('SUBTASK_TAGS')?.setValue('');
    }
  }


  removeRow(index: number) {
    this.authorityTableData.splice(index, 1);
  }

 
  // checkValue(values?: any) {
  //   const formArray = this.approvalTempForm.get('rows') as FormArray;
  //   // console.log('this.getRelAbbr from checkValue', values);

  //   if (!this.isCheckValueCalled) {
  //     // Process all the rows for the first time if checkValue is not yet called
  //     values.forEach((value: any) => {
  //       if (this.taskData && this.taskData.subtasK_LIST) {
  //         this.taskData.subtasK_LIST.forEach((subtask: any) => {
  //           const departmentList = this.departmentList;
  //           const matchedDepartment = departmentList.find(department => department.mkey === value.authoritY_DEPARTMENT);

  //           // console.log('matchedDepartment', matchedDepartment);

  //           if (matchedDepartment) {
  //             //console.log('matchedDepartment: ', matchedDepartment)
  //             value.sanctioN_DEPARTMENT = matchedDepartment.typE_DESC;
  //           } else {
  //             console.log("Department not found");
  //           }

  //           if (value.maiN_ABBR && value.maiN_ABBR === subtask.subtasK_ABBR) {
  //             const rowForm = this.fb.group({
  //               sequentialNo: [subtask.seQ_NO],
  //               abbrivation: [subtask.subtasK_ABBR],
  //               shorT_DESCRIPTION: [value.shorT_DESCRIPTION],
  //               sanctioN_DEPARTMENT: [value.sanctioN_DEPARTMENT || ''],
  //               nO_DAYS_REQUIRED: [value.dayS_REQUIERD || ''],
  //               authoritY_DEPARTMENT: [value.authoritY_DEPARTMENT || ''],
  //               enD_RESULT_DOC: [value.enD_RESULT_DOC || ''],
  //               subtasK_MKEY: [subtask.subtasK_MKEY],
  //               subTaskTags: [''],
  //             });

  //             formArray.push(rowForm);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }

  onCancel() {
    this.sidebarVisible = false;
  }

  onAdd() {
    console.log('Project added', this.projectForm.value);
  }

  resetFormValues() {

    this.resetGridBooleans();
  }


  authorityTableColumns:any = [
    { header: 'Sr No.', field: 'srNo', type: 'index' },

    { header: 'Sequential No.', field: 'sequentialNo', type: 'number' },

    {
      header: 'Abbreviation',
      field: 'abbrivation',
      type: 'dropdown',
      // options: [
      //   { label: 'ASD', value: 'asd' },
      //   { label: 'XYZ', value: 'xyz' },
      //   // add more as needed
      // ]
    },

    {
      header: 'Short Description',
      field: 'shorT_DESCRIPTION',
      type: 'dropdown',
      // options: [
      //   { label: 'Description A', value: 'desc_a' },
      //   { label: 'Description B', value: 'desc_b' },
      //   // add more as needed
      // ]
    },

    { header: 'Days Required', field: 'nO_DAYS_REQUIRED', type: 'text' },
    { header: 'Authority Department', field: 'authoritY_DEPARTMENT', type: 'text' },
    { header: 'End Result', field: 'enD_RESULT_DOC', type: 'text' },
    { header: '', field: 'actions', type: 'actions' }
  ];


  // authorityTableData = [
  //   { level: 1, sanctioningDepartment: 'Dep 1', sanctioningAuthority: 'A 1', isActive: true },
  //   { level: 2, sanctioningDepartment: 'Dep 2', sanctioningAuthority: 'A 2', isActive: false },
  // ];

  // Checklist
  searchQuery: string = '';

  // categories = [
  //   {
  //     name: 'Land Related',
  //     items: [
  //       { name: '7/12 utara', selected: false },
  //       { name: 'Deed', selected: true },
  //       { name: 'Land Doc Test Name', selected: false },
  //       { name: 'TP Remark', selected: false },
  //     ],
  //   },
  //   { name: "Form NOC's", items: [] },
  //   { name: 'CFO RTT TEST 1', items: [] },
  //   { name: 'ABC 56', items: [] },
  //   { name: 'Others', items: [] },
  // ];

  // checklist
  checkListTableColumns = [
    { header: 'Sr No', field: 'srNo' },
    { header: 'Document Category', field: 'documentCategory' },
    { header: 'Document Name', field: 'documentName' },
  ];
  checkListTableData = [{ srNo: 1, documentCategory: 'Land Related', documentName: 'Deed' }];

  resetValues() {
    this.numberOfDays = 0;
    this.selectedDate = new Date(); // Reset to today’s date
    this.selectedCompletionDate = null;
  }

  confirmSelection() {
    this.selectedCompletionDate = this.selectedDate;
  }


  togglePanel(panel: 'checklist' | 'outcome' | 'authority' | 'subtask') {
    if (panel === 'checklist') {
      this.showCheckList = !this.showCheckList;
      this.showOutcome = false;
      this.showAuthority = false;
      this.showSubTaskList = false;
    } else if (panel === 'outcome') {
      this.showOutcome = !this.showOutcome;
      this.showCheckList = false;
      this.showAuthority = false;
      this.showSubTaskList = false;
    } else if (panel === 'authority') {
      this.showAuthority = !this.showAuthority;
      this.showCheckList = false;
      this.showOutcome = false;
      this.showSubTaskList = false;
    } else if (panel === 'subtask') {
      this.showSubTaskList = !this.showSubTaskList;
      this.showCheckList = false;
      this.showOutcome = false;
      this.showAuthority = false;
    }
  }

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


  handleKeyDown(event: any) {
    const inputValue = (event.target as HTMLInputElement).value.trim();

    if (event.key === 'Enter' && inputValue) {
      // Check if city already exists
      const exists = this.tagsList.some(
        (city) => city.name.toLowerCase() === inputValue.toLowerCase(),
      );

      if (!exists) {
        const newCity = { name: inputValue };
        // this.tagsList.push(newCity);

        // this.selectedTag.push(inputValue);
        // this.cdr.detectChanges()
        // console.log(this.selectedTag)

        this.tagsList = [...this.tagsList, newCity]; // Create a new array for change detection
        this.selectedTag = [...this.selectedTag, inputValue]; // Ensure a new array reference
      }
      event.target.value = '';
      this.multiSelect.resetFilter();
      event.preventDefault();
    }
  }

  getTagsList() {
    let url = 'Task-Management/EMP_TAGS_NT';
    const body = {
      Current_Emp_Mkey: this.authData.Mkey.toString(),
      Filter: '',
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    return this.apiService.postDetails(url, body, true).pipe(
      tap(
        (res: any) => {
          this.tagsList = res[0].data;
        },
        (err) => {
          console.log(err);
        },
      ),
    );
  }


  getDocumentType(): Observable<any> {
    const url = 'Doc-Type-Instruction_NT';
    const body = {
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };

    return this.apiService.postDetails(url, body, false, true).pipe(
      tap((res: any) => {
        if (Array.isArray(res) && res[0]?.Data) {
          this.convertToCategoryArray(res[0].Data);
        } else {
          console.warn('Unexpected response format for Doc-Type-Instruction_NT', res);
        }
      }),
      catchError((err) => {
        console.error('getDocumentType failed:', err);
        return of(null); // Return fallback to prevent forkJoin from breaking
      })
    );
  }


  getDocumentTypeEndlist(): Observable<any> {
    const url = 'Doc-Type_NT';
    const body = {
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };

    return this.apiService.postDetails(url, body, false, true).pipe(
      tap((res: any) => {
        if (Array.isArray(res) && res[0]?.Data) {
          this.convertToEndlistArray(res[0].Data);
        } else {
          console.warn('Unexpected response format for Doc-Type_NT', res);
        }
      }),
      catchError((err) => {
        console.error('getDocumentTypeEndlist failed:', err);
        return of(null); // Prevents forkJoin failure
      })
    );
  }


  getDepartmentList(): Observable<any> {
    const url = 'Department_NT';
    const body = {
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };

    return this.apiService.postDetails(url, body, false, true).pipe(
      tap((res: any) => {
        if (Array.isArray(res) && res[0]?.Data) {

          const formatDept = res[0].Data.map((item: any) => ({
            Department_Type: item.Department_Type,
            Mkey: item.Mkey
          }));
          console.log('Department list: ', formatDept)
          this.department = cloneDeep(formatDept);
        } else {
          console.warn('Unexpected response format for Doc-Type_NT', res);
        }
      }),
      catchError((err) => {
        console.error('getDocumentTypeEndlist failed:', err);
        return of(null); // Prevents forkJoin failure
      })
    );
  }


  jobRoleList() {
    const url = 'Job-Role-Type_NT'

    const body = {
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };

    return this.apiService.postDetails(url, body, false, true).pipe(
      tap((res: any) => {
        if (Array.isArray(res) && res[0]?.Data) {

          const formatDept = res[0].Data.map((item: any) => ({
            Job_Role_Type: item.Job_Role_Type,
            Mkey: item.Mkey
          }));
          console.log('Job role list: ', res[0].Data)
          this.jobRole = cloneDeep(formatDept);
        } else {
          console.warn('Unexpected response format for Doc-Type_NT', res);
        }
      }),
      catchError((err) => {
        console.error('getDocumentTypeEndlist failed:', err);
        return of(null); // Prevents forkJoin failure
      })
    );
  }

  convertToCategoryArray(data: any[]) {

    const categoryMap = new Map();

    data.forEach((doc) => {
      const { Doc_Category_Name } = doc;

      if (!categoryMap.has(Doc_Category_Name)) {
        categoryMap.set(Doc_Category_Name, []);
      }

      // Add the whole object with an additional 'selected' field
      categoryMap.get(Doc_Category_Name)?.push({ ...doc, selected: false });
    });

    const documentData = Array.from(categoryMap.entries()).map(([Doc_Category_Name, items]) => ({
      Doc_Category_Name,
      items,
    }));

    this.checkListCategories = cloneDeep(documentData);
    this.tempCheckListCategories = cloneDeep(documentData);

    // this.outcomeCategories = cloneDeep(documentData);
    // this.tempOutcomeCategories = cloneDeep(documentData);
  }


  convertToEndlistArray(data: any[]) {
    const categoryMap = new Map();

    data.forEach((doc) => {
      const { Doc_Category_Name } = doc;

      if (!categoryMap.has(Doc_Category_Name)) {
        categoryMap.set(Doc_Category_Name, []);
      }

      // Add the whole object with an additional 'selected' field
      categoryMap.get(Doc_Category_Name)?.push({ ...doc, selected: false });
    });

    const documentData = Array.from(categoryMap.entries()).map(([Doc_Category_Name, items]) => ({
      Doc_Category_Name,
      items,
    }));

    // this.checkListCategories = cloneDeep(documentData);
    // this.tempCheckListCategories = cloneDeep(documentData);

    this.outcomeCategories = cloneDeep(documentData);
    this.tempOutcomeCategories = cloneDeep(documentData);
  }


  getBuilding() {
    let url = 'building-classification_NT';
    const body = {
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    return this.apiService.postDetails(url, body, false, true).pipe(
      tap(
        (res: any) => {
          if (Array.isArray(res) && res[0]?.Data) {

            const formatBuild = res[0].Data.map((item: any) => ({
              typE_DESC: item.typE_DESC,
              mkey: item.mkey
            }));
            console.log('formatBuild list: ', res[0].Data)
            this.building = cloneDeep(formatBuild);
          }
        },
        (err) => {
          console.log(err);
        },
      ),
    );
  }

  getBuildingStandard() {
    let url = 'Standard-Type-NT';
    const body = {
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    return this.apiService.postDetails(url, body, false, true).pipe(
      tap(
        (res: any) => {
          if (Array.isArray(res) && res[0]?.Data) {

            const formatStandard = res[0].Data.map((item: any) => ({
              Type_Desc: item.Type_Desc,
              Mkey: item.Mkey
            }));
            console.log('formatStandard list: ', res[0].Data)
            this.standard = cloneDeep(formatStandard);
          }
        },
        (err) => {
          console.log(err);
        },
      ),
    );
  }

  statutoryAuthority() {
    let url = 'Statutory-type-NT';
    const body = {
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    return this.apiService.postDetails(url, body, false, true).pipe(
      tap(
        (res: any) => {
          if (Array.isArray(res) && res[0]?.Data) {

            const formatAuth = res[0].Data.map((item: any) => ({
              Type_Desc: item.Type_Desc,
              Mkey: item.Mkey
            }));
            console.log('formatAuth list: ', res[0].Data)
            this.authority = cloneDeep(formatAuth);
          }
        },
        (err) => {
          console.log(err);
        },
      ),
    );
  }


  getAssignedPeopleDetails() {
    let url = 'Task-Management/Get-Emp_NT';
    const body = {
      Current_Emp_Mkey: this.authData.Mkey.toString(),
      Filter: '',
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    return this.apiService.postDetails(url, body, true).pipe(
      tap(
        (res: any) => {
          this.assignedPeopleList = res[0].data;
          //console.log('assignedPeopleList', this.assignedPeopleList)
        },
        (err) => {
          console.log(err);
        },
      ),
    );
  }

  onSelectOfAssignedPeople() {
    const selectedItem = this.assignedPeopleList.find(
      (item: any) => item.MKEY == this.projectForm.get('Assigned_To')?.value,
    );
    this.selectedAssignedPeopleLabel = selectedItem.EMP_FULL_NAME;
    //console.log('Chekc the selected assignee name: ', this.projectForm.get('Assigned_To')?.value);
  }

  updateCheckListTableData(item: any) {
    console.log('Item sent to table: ', item);

    const isPresent = this.checkListTableData.some(
      (data: any) => data.Doc_Type_Mkey === item.Doc_Type_Mkey
    );

    if (item.selected) {
      if (!isPresent) {
        const formattedItem = {
          srNo: this.checkListTableData.length + 1, // Auto incrementing srNo
          documentCategory: item.Doc_Category_Name,
          documentName: item.Doc_Type_Name,
          Doc_Type_Mkey: item.Doc_Type_Mkey, // Keep original key for tracking
        };

        this.checkListTableData.push(formattedItem);
      }
    } else {
      this.checkListTableData = this.checkListTableData.filter(
        (data: any) => data.Doc_Type_Mkey !== item.Doc_Type_Mkey
      );

      // Optional: Reset srNo after removal
      this.checkListTableData.forEach((data, index) => {
        data.srNo = index + 1;
      });
    }

    console.log('Updated Table Data:', this.checkListTableData);
  }

  updateOutcomeTableData(item: any) {
    if (item.selected) {
      const presentInTable = this.outcomeTableData.some(
        (data: any) => data.Doc_Type_Mkey === item.Doc_Type_Mkey,
      );

      if (!presentInTable) {
        const formattedItem = {
          srNo: this.outcomeTableData.length + 1, // Auto incrementing srNo
          documentCategory: item.Doc_Category_Name,
          documentName: item.Doc_Type_Name,
          Doc_Type_Mkey: item.Doc_Type_Mkey, // Keep original key for tracking
        };
        this.outcomeTableData.push(formattedItem);
      }
    } else {
      this.outcomeTableData = this.outcomeTableData.filter(
        (data: any) => data.Doc_Type_Mkey !== item.Doc_Type_Mkey,
      );
    }
  }

  onTableSave(type: 'checklist' | 'outcome') {
    if (type === 'checklist') {
      this.tempCheckListCategories = cloneDeep(this.checkListCategories);
      this.tempCheckListTableData = cloneDeep(this.checkListTableData);
    } else {
      this.tempOutcomeCategories = cloneDeep(this.outcomeCategories);
      this.tempOutcomeTableData = cloneDeep(this.outcomeTableData);
    }
  }


  onTableCancel(type: 'checklist' | 'outcome') {
    if (type === 'checklist') {
      this.checkListCategories = cloneDeep(this.tempCheckListCategories);
      this.checkListTableData = cloneDeep(this.tempCheckListTableData);
    } else {
      this.outcomeCategories = cloneDeep(this.tempOutcomeCategories);
      this.outcomeTableData = cloneDeep(this.tempOutcomeTableData);
    }
  }



  //   patchOutcome() {
  //   if (this.taskData?.Task_Endlist && this.outcomeCategories.length > 0) {
  //     // Clear existing outcome data
  //     this.outcomeTableData = [];

  //     // Iterate through the Task_Endlist data
  //     this.taskData.Task_Endlist.forEach((taskEndlistItem: any) => {
  //       // Get the Doc_Mkey from Task_Endlist
  //       const docMkey = +taskEndlistItem.Doc_Mkey;

  //       // Find the corresponding document in outcomeCategories
  //       const matchedDocument = this.outcomeCategories
  //         .flatMap((category: any) => category.items) // Flatten the nested structure
  //         .find((doc: any) => doc.Doc_Type_Mkey === docMkey);

  //       if (matchedDocument) {
  //         // Add the matched document to outcomeTableData
  //         this.outcomeTableData.push(matchedDocument);

  //         // Mark the document as selected in outcomeCategories
  //         matchedDocument.selected = true;
  //       }
  //     });

  //     // Update the temporary data for cancel functionality
  //     this.tempOutcomeTableData = cloneDeep(this.outcomeTableData);
  //   }
  // }

  resetGridBooleans() {
    this.showOutcome = false;
    this.showCheckList = false;
    this.showAuthority = false;
  }

  patchForm() { }
}
