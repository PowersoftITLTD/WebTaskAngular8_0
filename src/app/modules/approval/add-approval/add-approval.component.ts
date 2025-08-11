import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, NgModel, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { MultiSelect } from 'primeng/multiselect';
import { AuthService } from '../../../services/auth/auth.service';
import { catchError, forkJoin, Observable, of, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { storedDetails } from '../../../store/auth/auth.selectors';
import { NotificationService } from '../../../services/notification.service';
import { TemplateInterface } from '../../../shared/model/template.model';
import { TableColumn } from '../../../shared/components/tm-table/tm-table.component';


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
  sanctioningList: any[] = [];
  authorityTableData: any[] = [];

  levelTableData: any[] = [];


  selectedSanctioningAuthority: any;
  currentSanctioningLevel: any;
  currentSanctioningDepartment: any;
  currentSanctioningMode: any;

  startDate: any;
  endDate: any;

  private isCheckValueCalled: boolean = false;

  notificationService = inject(NotificationService);

  outcomeCategories: any = [];
  outcomeTableData: any = [];
  checkListTableData: any = [];//{ srNo: 1, documentCategory: 'Land Related', documentName: 'Deed' }

  checkListCategories: any = [];
  department: any = [];
  jobRole: any = [];

  tempAuthorityTableData: any = [];

  activePanel: 'checklist' | 'outcome' | null = null;

  formData = {
    level: '',
    sanctioningDepartment: '',
    sanctioningAuthority: '',
    startDate: null,
    endDate: null,
    mode: false
  };


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
  isEditingAuthority: boolean = false;

  // Calendar
  numberOfDays: number = 0;
  selectedDate: Date | null = null;
  selectedCompletionDate: Date | null = null;
  editedAuthorityId: number | null = null;
  todayDate = new Date();

  tentativeStartDate: Date | null = null;
  tentativeEndDate: Date | null = null;
  actualStartDate: Date | null = null;
  actualEndDate: Date | null = null;
  @Input() isEditMode: boolean = false;
  //@Input() formData: any;
  @ViewChild('multiSelect') multiSelect!: MultiSelect;
  @Input() isSubTask: boolean = false;
  @Input() parentTaskData: any;
  departmentList: any;

  onSidebarHide() {
    this.sidebarHide.emit();
  }
  addWork() {
    this.sidebarVisible = true;
  }
  // onCreate() {
  //   this.sidebarVisible = false;
  // }
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
      //console.log('Auth Data:', this.authData);

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
        this.getSancationDetails()
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


  // deleteAuthority(event: any) {
  //   // Mark as deleted rather than removing (if you need to track deletions for API)
  //   // if (this.isEditMode) {
  //   //   const index = this.authorityTableData.findIndex((item: any) => item.Mkey === event.Mkey);
  //   //   if (index !== -1) {
  //   //     this.authorityTableData[index].Delete_Flag = 'Y';
  //   //   }
  //   // } else {
  //   // For new items, just remove from array
  //   this.authorityTableData = this.authorityTableData.filter(
  //     (item: any) => item.Mkey !== event.mkey,
  //   );
  //   // }
  //   // this.notificationService.success('Authority deleted successfully');
  // }

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
            abbrivation: [null],
            shorT_DESCRIPTION: [null],
            sanctioN_DEPARTMENT: [null],
            nO_DAYS_REQUIRED: [null],
            authoritY_DEPARTMENT: [null],
            enD_RESULT_DOC: [null],
            subtasK_MKEY: [null],
            subTaskTags: [tagsString],
            sequentialNo: [rows.length + 1],
          });

          rows.push(newRow);

          console.log('Adding row from here: ', rows)
          const data = gerAbbrRelData.value[0]?.Data;

          // console.log('data newRow.value: ', data)

          // Step 1: Build unique Abbreviation options
          const abbrOptions = Array.from(
            new Map(
              data.map((item: any) => [item.Main_Abbr, {
                ...item,
                label: item.Main_Abbr, value: item.Main_Abbr
              }])
            ).values()
          );

          // console.log('abbrOptions: ', abbrOptions)

          // Step 2: Build unique Short Description options
          const shortDescOptions = Array.from(
            new Map(
              data.map((item: any) =>
                //console.log('Short description: ',item)
                [item.Short_Description?.trim(), {
                  label: item.Short_Description?.trim(),
                  value: item.Short_Description?.trim(),
                  ...item
                }]
              )
            ).values()
          );

          // console.log('shortDescOptions from add-approval: ', shortDescOptions)

          // Step 3: Update authorityTableColumns
          this.authorityTableColumns = this.authorityTableColumns.map((column: any) => {
            if (column.field === 'abbrivation') {
              return { ...column, options: abbrOptions };
            }
            if (column.field === 'shorT_DESCRIPTION') {
              return { ...column, options: shortDescOptions };
            }
            return column;
          });


          this.authorityTableData = [...this.authorityTableData, newRow.value];


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


  onTableRowChange(event: { rowIndex: number, field: string, value: any }) {

    console.log('onTableRowChange Event: ', event)

    const { rowIndex, field, value } = event;

    // Update the field in authorityTableData
    this.authorityTableData[rowIndex][field] = value;

    if (field === 'abbrivation' || field === 'shorT_DESCRIPTION') {

      const matchedItem = this.getRelAbbr[0]?.value[0]?.Data.find((item: any) => item.Main_Abbr === value) || this.getRelAbbr[0]?.value[0]?.Data.find((item: any) => item.Short_Description.trim() === value);
      const matchedDepartment = this.department.find((department: any) => department.Mkey === matchedItem?.Authority_Department);

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
          authoritY_DEPARTMENT: matchedItem.Authority_Dept,
          enD_RESULT_DOC: matchedItem.End_Result_Doc,
          subtasK_MKEY: matchedItem.Mkey
        };

        // Update the FormArray row too
        const rows = this.projectForm.get('rows') as FormArray;
        const targetRow = rows.at(rowIndex) as FormGroup;

        targetRow.patchValue({
          abbrivation: matchedItem.Main_Abbr,
          shorT_DESCRIPTION: matchedItem.Short_Description,
          sanctioN_DEPARTMENT: matchedItem.Authority_Department,
          nO_DAYS_REQUIRED: matchedItem.Days_Requierd,
          authoritY_DEPARTMENT: matchedItem.Authority_Dept,
          enD_RESULT_DOC: matchedItem.End_Result_Doc,
          subtasK_MKEY: matchedItem.Mkey
        });
      }
    }
  }


  removeRow(index: number) {
    this.authorityTableData.splice(index, 1);
    const rows = this.projectForm.get('rows') as FormArray;

    if (rows.length > 0) {
      rows.removeAt(index);

      this.updateSequentialNumbers();
    } else {
      console.warn('No rows to remove');
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


  columns: TableColumn[] = [
    { header: 'Task', field: 'task', isNested: false, sortKey: 'task' },
    { header: 'Assignee', field: 'assignee', isNested: false, sortKey: 'assignee' },
    { header: 'Status', field: 'status', statusField: true, sortKey: 'status' },
    {
      header: 'Due Date',
      field: 'dueDate',
      pipe: 'date',
      pipeParams: 'dd MMM yyyy',
      sortKey: 'dueDate',
    },
    { header: 'Priority', field: 'priority', isNested: false, sortKey: 'priority' },
    { header: 'Files', field: 'files', isNested: false },
    { header: 'Tags', field: 'tags', isNested: false },
    { header: 'Summary', field: 'summary', isNested: false },
    { header: 'Actions', isAction: true },
  ];


  authorityTableColumns: any = [
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

  authorityTableColumns_2: any = [
    { field: 'index', header: 'Serial No.' },
    { field: 'Level', header:'Level'},
    { field: 'Sanctioning_Department', header: 'Description' },
    { field: 'Type_Desc', header: 'Department' },
    // { field: 'Type_Code', header: 'Code' },
    { field: 'Start_date', header: 'Start Date' },
    { field: 'End_date', header: 'End Date' },
    { field: 'Mode', header: 'Active', isSwitch: true },
    { field: 'Action', header: 'Actions', deleteActions: true }

  ];

  // Checklist
  searchQuery: string = '';

  // checklist
  checkListTableColumns = [
    { header: 'Sr No', field: 'srNo' },
    { header: 'Document Category', field: 'documentCategory' },
    { header: 'Document Name', field: 'documentName' },
  ];
  //checkListTableData = [{ srNo: 1, documentCategory: 'Land Related', documentName: 'Deed' }];

  resetValues() {
    this.numberOfDays = 0;
    this.selectedDate = new Date(); // Reset to today’s date
    this.selectedCompletionDate = null;
  }

  confirmSelection() {
    this.selectedCompletionDate = this.selectedDate;
  }

  onAuthoritySave() {
    if (this.isEditingAuthority) {
      // If editing, we've already removed the old version
      this.isEditingAuthority = false;
      this.editedAuthorityId = null;
    }
    this.tempAuthorityTableData = cloneDeep(this.authorityTableData);

    this.currentSanctioningLevel = null;
    this.selectedSanctioningAuthority = null;
    this.currentSanctioningDepartment = null;
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
        //console.error('getDocumentType failed:', err);
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
          //console.log('Job role list: ', res[0].Data)
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
            //console.log('formatBuild list: ', res[0].Data)
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
            //console.log('formatStandard list: ', res[0].Data)
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
            //console.log('formatAuth list: ', res[0].Data)
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

  getSancationDetails() {
    let url = 'Sanctioning-Authority_NT';
    const body = {
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    return this.apiService.postDetails(url, body, false, true).pipe(
      tap(
        (res: any) => {
          this.sanctioningList = res[0]?.Data;
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
      this.checkListTableData.forEach((data: any, index: any) => {
        data.srNo = index + 1;
      });
    }

    // console.log('Updated Table checkListTableData:', this.checkListTableData);
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
    //console.log('Updated Table outcomeTableData:', this.outcomeTableData);
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

  addAuthority() {
    const newEntry = {
      level: this.formData.level,
      sanctioningDepartment: this.formData.sanctioningDepartment,
      sanctioningAuthority: this.formData.sanctioningAuthority,
      startDate: this.formData.startDate,
      endDate: this.formData.endDate,
      mode: this.formData.mode
    };


     console.log('newEntry: ', newEntry);
    // console.log('this.levelTableData: ',  this.levelTableData);

    this.levelTableData = [...this.levelTableData, newEntry];

    // console.log('levelTableData: ', this.levelTableData);

    // Optional: Clear form after adding
    // this.formData = {
    //   level: '',
    //   sanctioningDepartment: '',
    //   sanctioningAuthority: '',
    //   startDate: null,
    //   endDate: null,
    //   mode: false
    // };
  }



  // onCreate() {

  //   const created_by = this.authData?.Session_User_Id;
  //   const Business_Group_ID = this.authData?.Business_Group_Id

  //   const buildingType = this.projectForm.get('building')?.value;
  //   const buildingStandard = this.projectForm.get('standard')?.value;
  //   const statutoryAuthority = this.projectForm.get('authority')?.value;

  //   const projectAbbreviation = this.projectForm.get('projectAbbreviation')?.value;
  //   const shortDescription = this.projectForm.get('shortDescription')?.value;
  //   const longDescription = this.projectForm.get('longDescription')?.value;
  //   const authorityDept = this.projectForm.get('department')?.value;

  //   const assignTo = this.projectForm.get('Assigned_To')?.value;
  //   const jobRole = this.projectForm.get('jobRole')?.value;

  //   const tagsValue = this.projectForm.get('tags')?.value;
  //   const noOfDays = this.projectForm.get('noOfDays')?.value;
  //   const sequenceNo = this.projectForm.get('sequenceNo')?.value;

  //   let tagsString = '';
  //   // console.log('tagsValue', tagsValue)

  //   if (Array.isArray(tagsValue)) {
  //     tagsString = tagsValue.map(tag => {
  //       if (typeof tag === 'string') {
  //         return tag;
  //       } else if (tag.display) {
  //         return tag.display;
  //       } else {
  //         return '';
  //       }
  //     }).join(',');
  //   }

  //   const payload: TemplateInterface | any = {
  //     Mkey: 0,
  //     Building_Type: buildingType,
  //     Building_Standard: buildingStandard,
  //     Statutory_Authority: statutoryAuthority,
  //     Main_Abbr: projectAbbreviation,
  //     Short_Description: shortDescription,
  //     Long_Description: longDescription,
  //     Authority_Department: authorityDept,
  //     Resposible_Emp_Mkey: assignTo,
  //     Job_Role: jobRole,
  //     Tags: tagsString,
  //     Days_Requierd: noOfDays,
  //     Seq_Order: sequenceNo,
  //     Created_By: created_by,
  //     End_Result_Doc_Lst: this.outcomeTableData.reduce((acc: any, item: any) => {
  //       const category = item.documentCategory;
  //       const typeMkey = item.Doc_Type_Mkey;
  //       console.log('item: ',item)
  //       if (acc[category]) {
  //         acc[category] += `,${typeMkey}`;
  //       } else {
  //         acc[category] = `${typeMkey}`;
  //       }
  //       return acc;
  //     }, {}),

  //     Checklist_Doc_Lst: this.checkListTableData.reduce((acc: any, item: any) => {

  //       const category = item.documentCategory;
  //       const typeMkey = item.Doc_Type_Mkey;
  //       console.log('item: ',item)
  //       if (acc[category]) {
  //         acc[category] += `,${typeMkey}`;
  //       } else {
  //         acc[category] = `${typeMkey}`;
  //       }
  //       return acc;
  //     }, {}),
  //     // Subtask_List: Subtask[];
  //     Sanctioning_Department_List: null,
  //     Session_User_Id: created_by,
  //     Business_Group_Id: Business_Group_ID
  //   }



  //   console.log('Updated Table outcomeTableData:', this.outcomeTableData);
  //   console.log('Updated Table checkListTableData:', this.checkListTableData);
  //   console.log('Check payload', payload);
  // }


  onCreate() {
    const {
      building,
      standard,
      authority,
      projectAbbreviation,
      shortDescription,
      longDescription,
      department,
      Assigned_To,
      jobRole,
      tags,
      noOfDays,
      sequenceNo
    } = this.projectForm.value;

    const created_by = this.authData?.Session_User_Id;
    const Business_Group_ID = this.authData?.Business_Group_Id;

    const formArrayVal: FormArray = (this.projectForm.get('rows') as FormArray);
    const val_of_formArr = formArrayVal.value;

    const subTasks = val_of_formArr
      .filter((row: any) => {
        // Check if any field is empty. You can adjust this check based on the specific fields you want to validate.
        return row.subtasK_MKEY && row.sequentialNo && row.abbrivation;
      })
      .map((row: any, index: number) => {
        return {
          subtasK_MKEY: row.subtasK_MKEY,
          seQ_NO: row.sequentialNo.toString(),
          subtasK_ABBR: row.abbrivation,
          // SUBTASK_TAGS: sub_tags || null
        };
      });


    //   const formArrayVal_new: FormArray = (this.projectForm.get('rows_new') as FormArray);
    // const val_of_formArr_new = formArrayVal_new.value;

    const subAuth = this.levelTableData
      .map((row: any) => {
        return {
          LEVEL: row.Level.toString(),
          SANCTIONING_DEPARTMENT: row.Sanctioning_Department,
          SANCTIONING_AUTHORITY: row.sanctioningAuth,
          START_DATE: row.Start_date,
          END_DATE: row.End_date ? row.End_date : null
        }
      })

      console.log('Adding Sanctioning Authorities: ', this.levelTableData);

      console.log('subAuth: ', subAuth)

    const payload: TemplateInterface = {
      Mkey: 0,
      Building_Type: building,
      Building_Standard: standard,
      Statutory_Authority: authority,
      Main_Abbr: projectAbbreviation,
      Short_Description: shortDescription,
      Long_Description: longDescription,
      Authority_Department: department,
      Resposible_Emp_Mkey: Assigned_To,
      Job_Role: jobRole,
      Tags: this.formatTags(tags),
      Days_Requierd: noOfDays,
      Seq_Order: sequenceNo,
      Created_By: created_by,
      End_Result_Doc_Lst: this.reduceDocumentList(this.outcomeTableData),
      Checklist_Doc_Lst: this.reduceDocumentList(this.checkListTableData),
      Sanctioning_Department_List: [],
      Subtask_List: subTasks || [],
      Session_User_Id: created_by,
      Business_Group_Id: Business_Group_ID
    };

    const url = 'Approval-Template-Insert-Update-NT'

    console.log('Check payload', payload);
    // this.apiService.postDetails(url, payload, false, false, true).subscribe({
    //     next:(res)=>{
    //       console.log('res ',res)
    //     }
    //   } 
    // )



    // console.log('Updated Table outcomeTableData:', this.outcomeTableData);
    // console.log('Updated Table checkListTableData:', this.checkListTableData);
    // console.log('Check payload', payload);
  }

  onAuthorityCancel() {
    if (this.isEditingAuthority) {
      // Restore the original item if editing was cancelled
      const originalItem = this.tempAuthorityTableData.find(
        (item: any) => item.Mkey === this.editedAuthorityId,
      );
      if (originalItem) {
        this.authorityTableData = [...this.authorityTableData, originalItem];
      }
      this.isEditingAuthority = false;
      this.editedAuthorityId = null;
    }
    this.authorityTableData = cloneDeep(this.tempAuthorityTableData);

    this.currentSanctioningLevel = null;
    this.selectedSanctioningAuthority = null;
    this.currentSanctioningDepartment = null;
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


  private formatTags(tagsValue: any): string {
    if (!Array.isArray(tagsValue)) return '';
    return tagsValue.map(tag => typeof tag === 'string' ? tag : tag.display || '').join(',');
  }



  private reduceDocumentList(docList: any[]): { [key: string]: string } {
    //console.log('docList: ', docList)
    return docList.reduce((acc, item) => {
      const { documentCategory, Doc_Type_Mkey } = item;
      acc[documentCategory] = acc[documentCategory]
        ? `${acc[documentCategory].trim()},${Doc_Type_Mkey}`
        : `${Doc_Type_Mkey}`;
      return acc;
    }, {});
  }

  editAuthority(event: any) {
    // Store the original item in case of cancellation
    const originalItem = this.authorityTableData.find((item: any) => item.Mkey === event.Mkey);

    console.log('Check orignal item: ', originalItem)

    if (!originalItem) return;

    // Set up editing state
    this.isEditingAuthority = true;
    this.editedAuthorityId = event.Mkey;

    // Populate form fields
    this.currentSanctioningLevel = originalItem.Level;
    this.currentSanctioningDepartment = originalItem.Sanctioning_Department;
    this.selectedSanctioningAuthority = this.sanctioningList.find(
      (auth) => auth.Mkey === originalItem.Mkey,
    );
    this.currentSanctioningMode = originalItem.isActive;

    // Remove from table (will be re-added when saved)
    this.authorityTableData = this.authorityTableData.filter(
      (item: any) => item.Mkey !== event.Mkey,
    );
  }


  actions = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: (item: any) => this.editAuthority(item),
    },
  ];


  resetGridBooleans() {
    this.showOutcome = false;
    this.showCheckList = false;
    this.showAuthority = false;
  }

  cancelEditAuthority() {
    // Restore the original item
    const originalItem = this.tempAuthorityTableData.find(
      (item: any) => item.Mkey === this.editedAuthorityId,
    );

    if (originalItem) {
      this.authorityTableData = [...this.authorityTableData, originalItem];
    }

    this.resetAuthorityForm();
    this.isEditingAuthority = false;
    this.editedAuthorityId = null;
  }


  private resetAuthorityForm() {
    this.currentSanctioningLevel = null;
    this.selectedSanctioningAuthority = null;
    this.currentSanctioningDepartment = null;
    this.currentSanctioningMode = null;
  }


  checkLevel(control: NgModel) {
    const levelExist = this.authorityTableData.some(
      (data: any) => data.Level === control.control.value,
    );
    if (levelExist) {
      control.control.setErrors({ error: 'Level already exist' });
    } else {
      control.control.setErrors(null);
    }
  }


  onAddSanctioning() {
    if (
      this.currentSanctioningLevel &&
      this.selectedSanctioningAuthority &&
      this.currentSanctioningDepartment
    ) {
      const authority = {
        ...this.selectedSanctioningAuthority,
        Level: this.currentSanctioningLevel,
        Sanctioning_Department: this.currentSanctioningDepartment,
        Start_date: this.formatDate(this.startDate),
        End_date: this.formatDate(this.endDate),
        isActive: this.currentSanctioningMode,
        actions: true
      };

      if (this.isEditingAuthority && this.editedAuthorityId) {
        // For edit, preserve the original Mkey if it exists
        authority.Mkey = this.editedAuthorityId;
      }

      console.log('authority: ', authority)

      this.levelTableData.push(authority);

      console.log('levelTableData: ', this.levelTableData)

      // Reset form fields
      this.resetAuthorityForm();

      // this.notificationService.success(
      //   this.isEditingAuthority ? 'Authority updated successfully' : 'Authority added successfully',
      // );

      // Reset editing state
      this.isEditingAuthority = false;
      this.editedAuthorityId = null;
    }
  }

  formatDate(dateStr: any) {
    const date = new Date(dateStr);
    // Get components in desired format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // const hours = String(date.getHours()).padStart(2, '0');
    // const minutes = String(date.getMinutes()).padStart(2, '0');
    // const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}`; //T${hours}:${minutes}:${seconds}
  }

  deleteAuthority(rowData: any) {
    const index = this.levelTableData.indexOf(rowData);

    if (index !== -1) {
      this.levelTableData.splice(index, 1);
      console.log('Row deleted:', rowData);
    }
  }


  updateSequentialNumbers() {
    const rows = this.projectForm.get('rows') as FormArray;
    rows.controls.forEach((row, index) => {
      // Update the sequential number after a row is removed
      row.get('sequentialNo')?.setValue(index + 1); // Starts from 1
    });
  }

  patchForm() { }
}
