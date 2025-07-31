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

  authorityTableData:any[]=[];

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
      authority:[],
      building: [],

      jobRole: [],
      department: [],

      noOfDays: [this.legalEntities[0].value],
      sequenceNo:[],

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


  addRow() {
  console.log("Add row clicked");

  const newRow = {
    abbrivation: null,
    shorT_DESCRIPTION: null,
    sanctioN_DEPARTMENT: null,
    nO_DAYS_REQUIRED: null,
    authoritY_DEPARTMENT: null,
    enD_RESULT_DOC: null,
    subtasK_MKEY: null,
    subTaskTags: '',
    sequentialNo: this.authorityTableData.length + 1
  };

  // IMPORTANT: Use spread operator to trigger change detection
  this.authorityTableData = [...this.authorityTableData, newRow];
}


  // addRow(savedData?: any) {
  //   const buildingType = this.projectForm.get('building')?.value;
  //   const buildingStandard = this.projectForm.get('standard')?.value;
  //   const statutoryAuthority = this.projectForm.get('authority')?.value;

  

  //   const body = {
  //     buildingType:this.projectForm.get('building')?.value,
  //     buildingStandard: this.projectForm.get('standard')?.value,
  //     statutoryAuthority:this.projectForm.get('authority')?.value,
  //     Session_User_ID: this.authData?.Session_User_Id,
  //     Business_Group_ID: this.authData?.Business_Group_Id,
  //   }

  //   if (buildingType && buildingStandard && statutoryAuthority) {
  //    // this.recursiveLogginUser = this.apiService.getRecursiveUser();

  //     // API call to fetch abbreviation and other data
  //     this.apiService.getDetails(body).subscribe({
  //       next: (gerAbbrRelData) => {
  //        // this.checkValue(gerAbbrRelData); // Call checkValue to process the first time

  //         // console.log(gerAbbrRelData);
  //         this.getRelAbbr = Array.isArray(gerAbbrRelData) ? gerAbbrRelData : [gerAbbrRelData];

  //         if (this.getRelAbbr.length === 0) {
  //           //this.tostar.error("Details of this combination is empty or missing");
  //           return;
  //         }

  //         const rows: FormArray = this.projectForm.get('rows') as FormArray;



  //         const tagsValue = rows.get('subTaskTags')?.value || [];
  //         let tagsString: string = '';

  //         if (Array.isArray(tagsValue)) {
  //           tagsString = tagsValue.map(tag => {
  //             if (typeof tag === 'string') {
  //               return tag;
  //             } else if (tag.display) {
  //               return tag.display;
  //             } else {
  //               return '';
  //             }
  //           }).join(',');
  //         }

  //         // console.log('tagsString from row', tagsString);

  //         // Create a new row with the necessary controls
  //         const newRow = this.fb.group({
  //           abbrivation: [null, Validators.required],
  //           shorT_DESCRIPTION: [null],
  //           sanctioN_DEPARTMENT: [null],
  //           nO_DAYS_REQUIRED: [null],
  //           authoritY_DEPARTMENT: [null],
  //           enD_RESULT_DOC: [null],
  //           subtasK_MKEY: [null],
  //           subTaskTags: [tagsString],
  //           sequentialNo: [rows.length + 1],
  //         });

  //         rows.push(newRow);

  //         if (!this.isCheckValueCalled) {
  //           this.isCheckValueCalled = true;
  //         } else {
  //           //this.checkValueForNewRow(newRow);
  //         }
  //       },
  //       error: (err) => {
  //         this.notificationService.error('Unable to fetch data, please check internet connection');
  //        // this.tostar.error('Unable to fetch data, please check internet connection');
  //       }
  //     });
  //   } else {
  //     this.notificationService.error('Please select all classification');
      
  //     return;
  //   }
  // }

  removeRow(index: number) {
  this.authorityTableData.splice(index, 1);
}

onTableRowChange(event: { rowIndex: number, field: string, value: any }) {
  const { rowIndex, field, value } = event;
  this.authorityTableData[rowIndex][field] = value;

  if (field === 'abbreviation') {
    const selected = this.getRelAbbr.find(item => item.maiN_ABBR === value);
    if (selected) {
      this.authorityTableData[rowIndex].shortDescription = selected.shorT_DESCRIPTION;
      this.authorityTableData[rowIndex].daysRequired = selected.nO_DAYS_REQUIRED;
      this.authorityTableData[rowIndex].authorityDept = selected.sanctioN_DEPARTMENT;
      this.authorityTableData[rowIndex].endResult = selected.enD_RESULT_DOC;
    }
  }
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


  authorityTableColumns: any = [
    { header: 'Level', field: 'level' },
    { header: 'Sanctioning Department  ', field: 'sanctioningDepartment' },
    { header: 'Sanctioning Authority', field: 'sanctioningAuthority' },
    { header: 'Mode', isSwitch: true },
    { header: '', isAction: true },
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
          console.log('assignedPeopleList', this.assignedPeopleList)
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
    console.log('Chekc the selected assignee name: ', this.projectForm.get('Assigned_To')?.value);
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
