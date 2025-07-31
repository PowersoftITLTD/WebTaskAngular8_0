import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import { storedDetails } from '../../../store/auth/auth.selectors';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';
import { NotificationService } from '../../../services/notification.service';
import { cloneDeep } from 'lodash';
import { forkJoin, tap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Task_Add } from '../../../shared/model/app.model';

@Component({
  selector: 'app-tasks-add',
  templateUrl: './tasks-add.component.html',
  styleUrl: './tasks-add.component.scss',
})
export class TasksAddComponent {
  propertyDropdownValues: any[] = [];
  buildingDropDownValues: any[] = [];
  assignedPeopleList: any[] = [];
  tagsList: any[] = [];
  typeList: any[] = [];
  tasksList: any[] = [];
  sanctioningList: any[] = [];
  selectedSanctioningAuthority: any;
  currentSanctioningLevel: any;
  currentSanctioningDepartment: any;
  currentSanctioningMode: any;
  authData: any;
  taskForm!: FormGroup;
  @Input() sidebarVisible: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() formData: any;
  @Output() sidebarHide = new EventEmitter();
  @ViewChild('multiSelect') multiSelect!: MultiSelect;
  @Input() isSubTask: boolean = false;
  @Input() parentTaskData: any;

  notificationService = inject(NotificationService);

  isLoading: boolean = false;

  taskData: any;

  ngOnInit() {
    this.store.select(storedDetails).subscribe((data) => {
      this.authData = data;
      console.log('Auth Data:', this.authData);

      // Fetch all dropdown data and wait for all to complete
      if (this.isEditMode) {
        this.spinner.show();
      }
      forkJoin([
        this.getPropertyDropdownDetails('PROJECT'),
        this.getPropertyDropdownDetails('Category'),
        this.getAssignedPeopleDetails(),
        this.getTagsList(),
        this.getTypeList(),
        this.getDocumentType(),
        this.getSancationDetails(),
      ]).subscribe({
        next: () => {
          if (this.isEditMode) {
            this.spinner.hide();
            this.patchForm();
          }
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error fetching dropdown data:', err);
        },
      });
    });

    this.initForm();
    this.resetFormValues();
  }
  previousValues!: {
    Tentative_Start_Date: any;
    Tentative_End_Date: any;
    Actual_Start_Date: any;
    Actual_End_Date: any;
  };

  initForm() {
    this.taskForm = this._fb.group({
      taskName: ['', Validators.required],
      description: ['', Validators.required],
      Assigned_To: ['', Validators.required],
      Project_Id: [''],
      Subproject_Id: [''],
      Tentative_Start_Date: [null],
      Tentative_End_Date: [null],
      Actual_Start_Date: [null],
      Actual_End_Date: [null],
      numberOfDays: [null],
      completionDate: [null, Validators.required],
      Category: ['', Validators.required],
      Type: [''],
      Priority: ['Low', Validators.required],
    });
    this.savePreviousValues();
  }

  savePreviousValues() {
    this.previousValues = {
      Tentative_Start_Date: this.taskForm.get('Tentative_Start_Date')?.value,
      Tentative_End_Date: this.taskForm.get('Tentative_End_Date')?.value,
      Actual_Start_Date: this.taskForm.get('Actual_Start_Date')?.value,
      Actual_End_Date: this.taskForm.get('Actual_End_Date')?.value,
    };
  }

  resetDateValues() {
    this.taskForm.patchValue({
      Tentative_Start_Date: this.previousValues.Tentative_Start_Date,
      Tentative_End_Date: this.previousValues.Tentative_End_Date,
      Actual_Start_Date: this.previousValues.Actual_Start_Date,
      Actual_End_Date: this.previousValues.Actual_End_Date,
    });
  }

  confirmDateSelection() {
    this.savePreviousValues();
  }

  onSidebarHide() {
    this.sidebarHide.emit();
  }

  onCancel() {
    this.resetFormValues();
    // this.sidebarVisible = false;
    this.onSidebarHide();
  }

  constructor(
    private apiService: AuthService,
    private store: Store,
    private _fb: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {}
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
  // selectedProperty: any;
  selectedPropertyLabel: any;
  // selectedBuilding: any;
  selectedBuildingLabel: any;
  selectedAssignedPeopleLabel: any;
  selectedAssignee: any;
  selectedAuthority: any;
  isEditingAuthority: boolean = false;
  editedAuthorityId: number | null = null;
  // selectedCategory: any = 64;
  // selectedType: any = 550;
  selectedTag: any[] = [];
  // selectedPriority: any = 'Low';

  showCheckList: boolean = false;
  showOutcome: boolean = false;
  showAuthority: boolean = false;
  // category
  categoryList: any[] = [];
  //Type

  // Calendar
  numberOfDays: number = 0;
  selectedDate: Date | null = null;
  selectedCompletionDate: Date | null = null;
  todayDate = new Date();
  tempCompletionDate: Date | null = null;
  tempNumberOfDays: number | null = null;

  tentativeStartDate: Date | null = null;
  tentativeEndDate: Date | null = null;
  actualStartDate: Date | null = null;
  actualEndDate: Date | null = null;
  // file upload
  selectedFile: any;

  updateCalendar() {
    const days = this.taskForm.get('numberOfDays')?.value || 0;
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    this.taskForm.patchValue({ completionDate: newDate });
  }

  onCreate() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.notificationService.error('Please fill in all required fields before saving');
      return;
    }
    // this.resetFormValues();
    // this.sidebarVisible = false;
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // const araray = this.selectedTag;
    const tagsString = this.selectedTag.length ? this.selectedTag.join(', ') : '';
    const payload: Task_Add = {
      Mode: this.isEditMode ? 'M' : 'A',
      Task_No: this.isEditMode ? this.taskData?.Mkey?.toString() : '0',
      Task_Name: this.taskForm.value.taskName,
      Task_Description: this.taskForm.value.description,
      Category: this.taskForm.get('Category')?.value,
      Project_Id: this.taskForm.get('Project_Id')?.value || 0,
      Subproject_Id: this.taskForm.get('Subproject_Id')?.value || 0,
      Completion_Date: this.taskForm.get('completionDate')?.value
        ? this.formatDate(this.taskForm.get('completionDate')?.value)
        : '',
      Assigned_To: this.taskForm.value.Assigned_To.toString(),
      Task_Type: this.taskForm.value.Type,
      Tags: tagsString,
      Isnode: 'N',
      Start_Date: '',
      Close_Date: '',
      Due_Date: '', // Static value
      Task_Parent_Id: this.isEditMode ? this.taskData?.Task_Parent_Id?.toString() : '0',
      Status: 'Open',
      Status_Perc: '0',
      Task_Created_By: this.authData?.Mkey,
      Approver_Id: 0,
      Is_Archive: 'N',
      Attribute1: this.authData?.Attribute1 ?? '',
      Attribute2: this.authData?.Attribute2 ?? '',
      Attribute3: this.authData?.Attribute3 ?? '',
      Attribute4: this.authData?.Attribute4 ?? '',
      Attribute5: this.authData?.Attribute5 ?? '',
      Created_By: this.authData?.Mkey,
      Creation_Date: formattedDate ? formattedDate : '',
      // "Last_Updated_By": this.authData.userId,
      Approve_Action_Date: '',
      Session_User_ID: this.authData.userId.toString(),
      Business_Group_ID: this.authData.Business_Group_Id.toString(),
      Priority: this.taskForm.value.Priority,
      Tentative_Start_Date: this.taskForm.value.Tentative_Start_Date
        ? this.formatDate(this.taskForm.value.Tentative_Start_Date)
        : null,
      Tentative_End_Date: this.taskForm.value.Tentative_End_Date
        ? this.formatDate(this.taskForm.value.Tentative_End_Date)
        : null,
      Actual_Start_Date: this.taskForm.value.Actual_Start_Date
        ? this.formatDate(this.taskForm.value.Actual_Start_Date)
        : null,
      Actual_End_Date: this.taskForm.value.Actual_End_Date
        ? this.formatDate(this.taskForm.value.Actual_End_Date)
        : null,
      Delete_Flag: 'N',
      Task_Checklist: this.getCheckListPayload,
      // Task_Checklist: this.checkListTableData.map((item: any, index: number) => {
      //   // Find the original item to preserve Sr_No in edit mode
      //   const originalItem =
      //     this.isEditMode &&
      //     this.taskData?.Task_Checklist?.find(
      //       (checkItem: any) => checkItem.Doc_Mkey == item.Doc_Type_Mkey,
      //     );

      //   return {
      //     Task_Mkey: this.isEditMode ? +this.taskData?.Mkey : 0,
      //     Sr_No:
      //       this.isEditMode && this.taskData?.Task_Checklist
      //         ? originalItem
      //           ? originalItem.Sr_No
      //           : 0
      //         : 0,
      //     Doc_Mkey: item.Doc_Type_Mkey,
      //     Document_Category: item.Doc_Category_Mkey,
      //     Delete_Flag: 'N',
      //     Created_By: this.authData?.Mkey.toString(),
      //   };
      // }),
      Task_Endlist: this.outcomeTableData.length
        ? [
            {
              Mkey: this.isEditMode ? +this.taskData?.Mkey : 0,
              Sr_No: this.isEditMode && this.taskData?.Task_Endlist ? 1 : 0,
              Output_Doc_List: this.outcomeTableData.reduce((acc: any, item: any) => {
                const category = item.Doc_Category_Name;
                const typeMkey = item.Doc_Type_Mkey.toString();

                if (acc[category]) {
                  acc[category] += `,${typeMkey}`;
                } else {
                  acc[category] = typeMkey;
                }

                return acc;
              }, {}),
              Created_By: this.authData?.Mkey.toString(),
              Delete_Flag: 'N',
            },
          ]
        : [],
      Task_Sanctioning: this.getSanctioningListPayload,
      // Task_Sanctioning: this.authorityTableData.map((item: any, index: number) => {
      //   // Find the original item to preserve Sr_No in edit mode
      //   const originalItem =
      //     this.isEditMode &&
      //     this.taskData?.Task_Sanctioning?.find(
      //       (authItem: any) => authItem.Sanctioning_Authority_Mkey == item.Mkey,
      //     );

      //   return {
      //     Mkey: this.isEditMode ? +this.taskData?.Mkey : 0,
      //     Sr_No:
      //       this.isEditMode && this.taskData?.Task_Sanctioning
      //         ? originalItem
      //           ? originalItem.Sr_No
      //           : 0
      //         : 0,
      //     Level: item.Level,
      //     Sanctioning_Department: item.Sanctioning_Department,
      //     Sanctioning_Authority_Mkey: item.Mkey?.toString(),
      //     Created_By: this.authData?.Mkey,
      //     Status: item.isActive ? 'Completed' : 'In Progress',
      //     Delete_Flag: 'N',
      //   };
      // }),
    };
    console.log(payload);
    // return;
    this.isLoading = true;
    if (this.isSubTask) {
      // Mkey
      payload.Task_No = this.parentTaskData.Mkey.toString();
      payload.Task_Parent_Id = this.parentTaskData.Mkey;
      payload.Task_Parent_Node_Id = +this.parentTaskData.Mkey;
      payload.Current_task_mkey = +this.parentTaskData.Mkey;
      payload.Task_Parent_Number = this.parentTaskData.Task_No.toString();
      payload.Tags = tagsString;
      payload.Approver_Id = this.authData?.Mkey.toString();

      let url = 'Task-Management/Add-Sub-Task_NT';
      this.apiService.postDetails(url, payload, true).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = false;
          this.taskForm.reset();
          this.resetFormValues();
          this.resetDateValues();
          this.onSidebarHide();
          if (this.isEditMode) {
            this.notificationService.success('Sub Task updated successfully');
          } else {
            this.notificationService.success('Sub Task added successfully');
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    } else {
      let url = 'Task-Management/Add-Task_NT';
      this.apiService.postDetails(url, payload, true).subscribe(
        (res) => {
          if (res) {
            console.log(res);
            this.isLoading = false;
            this.taskForm.reset();
            this.resetFormValues();
            this.resetDateValues();
            this.onSidebarHide();
            if (this.isEditMode) {
              this.notificationService.success('Task updated successfully');
            } else {
              this.notificationService.success('Task added successfully');
            }
          }
        },
        (err) => {
          console.log(err);
          this.isLoading = false;
        },
      );
    }
  }

  updateDays() {
    const selectedDate: Date = this.taskForm.get('completionDate')?.value;
    if (selectedDate) {
      const diff = Math.ceil(
        (selectedDate.getTime() - this.todayDate.getTime()) / (1000 * 3600 * 24),
      );
      this.taskForm.patchValue({ numberOfDays: diff });
    }
  }

  resetValues() {
    this.taskForm.patchValue({
      completionDate: this.tempCompletionDate,
      numberOfDays: this.tempNumberOfDays,
    });
  }

  resetFormValues() {
    this.taskForm.reset();
    // this.selectedProperty = null;
    this.selectedPropertyLabel = null;
    // this.selectedBuilding = null;
    this.selectedBuildingLabel = null;
    this.selectedAssignee = null;
    this.selectedAssignedPeopleLabel = null;
    // this.selectedCategory = null;
    // this.selectedType = null;
    this.selectedTag = [];
    this.taskForm.get('Category')?.patchValue(190);
    this.taskForm.get('Type')?.patchValue(419);
    this.taskForm.get('Priority')?.patchValue('Low');
    this.getTagsList();
    //Reset grid booleans
    this.resetGridBooleans();
  }
  resetGridBooleans() {
    this.showOutcome = false;
    this.showCheckList = false;
    this.showAuthority = false;
  }

  confirmSelection() {
    this.tempCompletionDate = new Date(this.taskForm.get('completionDate')?.value);
    this.tempNumberOfDays = this.taskForm.get('numberOfDays')?.value;
  }

  // Authority
  // Table column definitions
  authorityTableColumns: any = [
    { header: 'Level', field: 'Level' },
    { header: 'Sanctioning Department  ', field: 'Sanctioning_Department' },
    { header: 'Sanctioning Authority', field: 'Type_Desc' },
    { header: 'Mode', isSwitch: true },
    { header: '', isAction: true },
  ];
  authorityTableData: any = [];
  tempAuthorityTableData: any = [];

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
        isActive: this.currentSanctioningMode,
      };

      if (this.isEditingAuthority && this.editedAuthorityId) {
        // For edit, preserve the original Mkey if it exists
        authority.Mkey = this.editedAuthorityId;
      }

      this.authorityTableData.push(authority);

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

  deleteAuthority(event: any) {
    // Mark as deleted rather than removing (if you need to track deletions for API)
    // if (this.isEditMode) {
    //   const index = this.authorityTableData.findIndex((item: any) => item.Mkey === event.Mkey);
    //   if (index !== -1) {
    //     this.authorityTableData[index].Delete_Flag = 'Y';
    //   }
    // } else {
    // For new items, just remove from array
    this.authorityTableData = this.authorityTableData.filter(
      (item: any) => item.Mkey !== event.Mkey,
    );
    // }
    // this.notificationService.success('Authority deleted successfully');
  }

  editAuthority(event: any) {
    // Store the original item in case of cancellation
    const originalItem = this.authorityTableData.find((item: any) => item.Mkey === event.Mkey);

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

  // Checklist
  searchQuery: string = '';

  // categories: any = [];
  checkListCategories: any = [];
  tempCheckListCategories: any = [];

  outcomeCategories: any = [];
  tempOutcomeCategories: any = [];

  // checklist
  checkListTableColumns = [
    { header: 'Sr No', field: 'index' },
    { header: 'Document Category', field: 'Doc_Category_Name' },
    { header: 'Document Name', field: 'Doc_Type_Name' },
  ];
  checkListTableData: any = [];
  tempCheckListTableData: any = [];

  outcomeTableData: any = [];
  tempOutcomeTableData: any = [];

  getPropertyDropdownDetails(Type: string) {
    let url = 'Task-Management/Get-Option_NT';
    const body = {
      Type_Code: Type,
      Master_Mkey: this.authData.Mkey.toString(),
    };
    return this.apiService.postDetails(url, body, true).pipe(
      tap(
        (res: any) => {
          if (Type.toLowerCase() === 'project') {
            this.propertyDropdownValues = res[0].Data;
          } else {
            this.categoryList = res[0].Data;
          }
        },
        (err) => {
          console.log(err);
        },
      ),
    );
  }
  getBuildingDropdownDetails() {
    const selectedItem = this.propertyDropdownValues.find(
      (item: any) => item.Master_Mkey === this.taskForm.get('Project_Id')?.value,
    );
    this.selectedPropertyLabel = selectedItem.Type_Desc;
    // return;
    let url = 'Task-Management/Get-Sub_Project_NT';
    const body = {
      Project_Mkey: this.taskForm.get('Project_Id')?.value.toString(),
      Session_User_ID: 'string',
      Business_Group_ID: 'string',
    };
    this.apiService.postDetails(url, body, true).subscribe(
      (res: any) => {
        console.log(res);
        this.buildingDropDownValues = res[0].data;
        if (this.isEditMode) {
          this.selectOfBuilding();
        }
      },
      (err) => {
        console.log(err);
      },
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
        },
        (err) => {
          console.log(err);
        },
      ),
    );
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
  getTypeList() {
    let url = 'Task-Type_NT';
    const body = {
      // "Current_Emp_Mkey": this.authData.Mkey.toString(),
      // "Filter": '',
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    return this.apiService.postDetails(url, body, false, true).pipe(
      tap(
        (res: any) => {
          this.typeList = res[0].Data;
        },
        (err) => {
          console.log(err);
        },
      ),
    );
  }

  getTaskList() {
    let url = 'Task-Management/Task-Dashboard_NT';
    const body = {
      Current_Emp_Mkey: this.authData.Mkey.toString(),
      Filter: '',
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    this.apiService.postDetails(url, body, true).subscribe(
      (res: any) => {
        this.tasksList = res[0].data;
      },
      (err) => {
        console.log(err);
      },
    );
  }

  getDocumentType() {
    let url = 'Doc-Type-Instruction_NT';
    const body = {
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    return this.apiService.postDetails(url, body, false, true).pipe(
      tap(
        (res: any) => {
          // console.log('==>', res[0]?.Data);
          if (res[0]?.Data) {
            this.convertToCategoryArray(res[0]?.Data);
          }
        },
        (err) => {
          console.log(err);
        },
      ),
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

    this.outcomeCategories = cloneDeep(documentData);
    this.tempOutcomeCategories = cloneDeep(documentData);
  }

  updateCheckListTableData(item: any) {
    if (item.selected) {
      const presentInTable = this.checkListTableData.some(
        (data: any) => data.Doc_Type_Mkey === item.Doc_Type_Mkey,
      );

      if (!presentInTable) {
        this.checkListTableData.push(item);
      }
    } else {
      this.checkListTableData = this.checkListTableData.filter(
        (data: any) => data.Doc_Type_Mkey !== item.Doc_Type_Mkey,
      );
    }
  }

  updateOutcomeTableData(item: any) {
    if (item.selected) {
      const presentInTable = this.outcomeTableData.some(
        (data: any) => data.Doc_Type_Mkey === item.Doc_Type_Mkey,
      );

      if (!presentInTable) {
        this.outcomeTableData.push(item);
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

  selectOfBuilding() {
    const selectedItem = this.buildingDropDownValues.find(
      (item: any) => item.MASTER_MKEY == this.taskForm.get('Subproject_Id')?.value,
    );
    this.selectedBuildingLabel = selectedItem.TYPE_DESC;
    // this.getAssignedPeopleDetails();
  }
  onSelectOfAssignedPeople() {
    console.log(this.selectedAssignee);
    const selectedItem = this.assignedPeopleList.find(
      (item: any) => item.MKEY == this.taskForm.get('Assigned_To')?.value,
    );
    this.selectedAssignedPeopleLabel = selectedItem.EMP_FULL_NAME;
  }
  formatDate(dateString: any) {
    console.log(dateString);
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-CA');
    return formattedDate;
  }
  updateFormControl(event: any) {
    if (!event.textValue) {
      setTimeout(() => {
        this.taskForm.get('description')?.patchValue('');
        this.taskForm.get('description')?.markAsTouched();
      }, 0);
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
  removeTag(tagToRemove: any) {
    this.selectedTag = this.selectedTag.filter((tag) => tag.name !== tagToRemove.name);
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

  patchForm() {
    let url = 'Task-Management/Task-Details_By_Mkey_NT';
    const body = {
      Mkey: +this.formData.Mkey,
      Session_User_ID: this.authData?.Session_User_Id,
      Business_Group_ID: this.authData?.Business_Group_Id,
    };
    this.apiService.postDetails(url, body, true).subscribe({
      next: (res) => {
        const data = res[0]?.Data[0];
        this.taskData = res[0]?.Data[0];

        // Patch form values
        this.taskForm.patchValue({
          taskName: data?.Task_Name,
          description: data?.Task_Description,
          Project_Id: +data?.Project_Mkey,
          Subproject_Id: +data?.Building_Mkey,
          Assigned_To: data?.Assigned_To,
          completionDate: data?.Completion_Date ? new Date(data?.Completion_Date) : null,
          Tentative_Start_Date: data?.Tentative_Start_Date
            ? new Date(data?.Tentative_Start_Date)
            : null,
          Tentative_End_Date: data?.Tentative_End_Date ? new Date(data?.Tentative_End_Date) : null,
          Actual_Start_Date: data?.Actual_Start_Date ? new Date(data?.Actual_Start_Date) : null,
          Actual_End_Date: data?.Actual_End_Date ? new Date(data?.Actual_End_Date) : null,
          Category: data?.Category_Mkey,
          Type: data?.Task_Type,
          Priority: data?.Priority,
        });

        // Update calculated fields
        this.updateDays();
        this.confirmSelection();
        this.savePreviousValues();
        this.onSelectOfAssignedPeople();

        // Patch tags
        if (data?.Tags) {
          this.selectedTag = data?.Tags.split(',').map((tag: string) => tag.trim());
        }

        // Fetch building dropdown details
        this.getBuildingDropdownDetails();

        this.patchCheckList();
        this.patchOutcome();
        this.patchAuthority();
      },
      error: (err) => {
        console.error('Error fetching task details:', err);
        this.notificationService.error('Failed to fetch task details. Please try again.');
      },
    });
  }

  patchCheckList() {
    if (this.taskData?.Task_Checklist && this.checkListCategories.length > 0) {
      this.checkListTableData = [];

      this.taskData.Task_Checklist.forEach((item: any) => {
        const matchedDoc = this.checkListCategories
          .flatMap((cat: any) => cat.items)
          .find((doc: any) => doc.Doc_Type_Mkey === +item.Doc_Mkey);

        if (matchedDoc) {
          this.checkListTableData.push({
            ...matchedDoc,
            Doc_Category_Mkey: item.Document_Category,
            Sr_No: item.Sr_No, // Preserve the original Sr_No
          });

          matchedDoc.selected = true;
        }
      });

      this.tempCheckListTableData = cloneDeep(this.checkListTableData);
    }
  }

  patchOutcome() {
    if (this.taskData?.Task_Endlist && this.outcomeCategories.length > 0) {
      // Clear existing outcome data
      this.outcomeTableData = [];

      // Iterate through the Task_Endlist data
      this.taskData.Task_Endlist.forEach((taskEndlistItem: any) => {
        // Get the Doc_Mkey from Task_Endlist
        const docMkey = +taskEndlistItem.Doc_Mkey;

        // Find the corresponding document in outcomeCategories
        const matchedDocument = this.outcomeCategories
          .flatMap((category: any) => category.items) // Flatten the nested structure
          .find((doc: any) => doc.Doc_Type_Mkey === docMkey);

        if (matchedDocument) {
          // Add the matched document to outcomeTableData
          this.outcomeTableData.push(matchedDocument);

          // Mark the document as selected in outcomeCategories
          matchedDocument.selected = true;
        }
      });

      // Update the temporary data for cancel functionality
      this.tempOutcomeTableData = cloneDeep(this.outcomeTableData);
    }
  }

  patchAuthority() {
    if (this.taskData?.Task_Sanctioning) {
      this.authorityTableData = this.taskData.Task_Sanctioning.map((item: any) => ({
        Level: item.Level,
        Sanctioning_Department: item.Sanctioning_Department,
        Mkey: item.Sanctioning_Authority_Mkey,
        Type_Desc: item.Type_Desc || item.Sanctioning_Authority_Name,
        isActive: item.Status === 'Completed',
        Sr_No: item.Sr_No, // Preserve the original Sr_No
      }));

      this.tempAuthorityTableData = cloneDeep(this.authorityTableData);
    }
  }

  get getCheckListPayload() {
    // Get original checklist items from taskData (for edit mode)
    const originalChecklistItems = this.isEditMode ? this.taskData?.Task_Checklist || [] : [];

    // Create payload for Task_Checklist
    const currentChecklistItems = this.checkListTableData.map((item: any, index: number) => {
      const originalItem = originalChecklistItems.find(
        (checkItem: any) => checkItem.Doc_Mkey == item.Doc_Type_Mkey,
      );

      return {
        Task_Mkey: this.isEditMode ? +this.taskData?.Mkey : 0,
        Sr_No: originalItem ? originalItem.Sr_No : 0,
        Doc_Mkey: item.Doc_Type_Mkey,
        Document_Category: item.Doc_Category_Mkey,
        Delete_Flag: 'N', // Current items are not deleted
        Created_By: this.authData?.Mkey.toString(),
      };
    });

    // Find items that were removed (exist in original but not in current)
    const removedChecklistItems = originalChecklistItems
      .filter((originalItem: any) => {
        return !this.checkListTableData.some(
          (currentItem: any) => currentItem.Doc_Type_Mkey == originalItem.Doc_Mkey,
        );
      })
      .map((removedItem: any) => ({
        Task_Mkey: this.isEditMode ? +this.taskData?.Mkey : 0,
        Sr_No: removedItem ? removedItem.Sr_No : 0,
        Doc_Mkey: removedItem.Doc_Type_Mkey,
        Document_Category: removedItem.Doc_Category_Mkey,
        Delete_Flag: 'Y', // Mark removed items for deletion
        Created_By: this.authData?.Mkey.toString(),
      }));

    // Combine current and removed items
    const finalChecklistPayload = [...currentChecklistItems, ...removedChecklistItems];
    return finalChecklistPayload;
  }

  get getSanctioningListPayload() {
    const originalSanctioningItems = this.isEditMode ? this.taskData?.Task_Sanctioning || [] : [];
    const currentSanctioningItems = this.authorityTableData.map((item: any, index: number) => {
      const originalItem = originalSanctioningItems.find(
        (authItem: any) => authItem.Sanctioning_Authority_Mkey == item.Mkey?.toString(),
      );
      return {
        Mkey: this.isEditMode ? +this.taskData?.Mkey : 0,
        Sr_No: originalItem ? originalItem.Sr_No : 0,
        Level: item.Level,
        Sanctioning_Department: item.Sanctioning_Department,
        Sanctioning_Authority_Mkey: item.Mkey?.toString(),
        Created_By: this.authData?.Mkey,
        Status: item.isActive ? 'Completed' : 'In Progress',
        Delete_Flag: 'N',
      };
    });
    const removedSanctioningItems = originalSanctioningItems
      .filter(
        (originalItem: any) =>
          !this.authorityTableData.some(
            (currentItem: any) =>
              currentItem.Mkey?.toString() == originalItem.Sanctioning_Authority_Mkey,
          ),
      )
      .map((removedItem: any) => ({
        Mkey: this.isEditMode ? +this.taskData?.Mkey : 0,
        Sr_No: removedItem ? removedItem.Sr_No : 0,
        Level: removedItem.Level,
        Sanctioning_Department: removedItem.Sanctioning_Department,
        Sanctioning_Authority_Mkey: removedItem.Mkey?.toString(),
        Created_By: this.authData?.Mkey,
        Status: removedItem.isActive ? 'Completed' : 'In Progress',
        Delete_Flag: 'Y',
      }));

    // Combine current and removed items
    const finalSanctioningListPayload = [...currentSanctioningItems, ...removedSanctioningItems];
    return finalSanctioningListPayload;
  }
}
