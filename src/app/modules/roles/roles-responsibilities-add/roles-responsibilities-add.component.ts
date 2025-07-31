import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-roles-responsibilities-add',
  templateUrl: './roles-responsibilities-add.component.html',
  styleUrls: ['./roles-responsibilities-add.component.scss'],
})
export class RolesResponsibilitiesAddComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Roles & Responsibilities', url: '/role' },
    { label: 'New Role Creation', url: '/' },
  ];
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  onEditPage = false;

  MODULES = {
    DASHBOARD: 'DASHBOARD',
    TASKS: 'TASKS',
    DOCUMENT_DEPOSITORY: 'DOCUMENT_DEPOSITORY',
    APPROVAL_TEMPLATE: 'APPROVAL_TEMPLATE',
    DOCUMENT_TEMPLATE: 'DOCUMENT_TEMPLATE',
    CATEGORIES: 'CATEGORIES',
    INSTRUCTION: 'INSTRUCTION',
  };
  buildings: string[] = ['Building A', 'Building B', 'Building C'];
  roleDetail: any;
  dataVisible = false;
  isEditing = false;
  roleId: string = '';
  isPatching = false; // Flag to prevent triggering subscriptions

  // Role Form
  roleForm = this.fb.group({
    roleName: ['', Validators.required],
    selectedBuilding: ['', Validators.required],
  });

  // Permission Form
  permissionForm = this.fb.group({
    DASHBOARD: this.createPermission(this.MODULES.DASHBOARD),
    TASKS: this.createPermission(this.MODULES.TASKS),
    DOCUMENT_DEPOSITORY: this.createPermission(this.MODULES.DOCUMENT_DEPOSITORY),
    APPROVAL_TEMPLATE: this.createPermission(this.MODULES.APPROVAL_TEMPLATE),
    DOCUMENT_TEMPLATE: this.createPermission(this.MODULES.DOCUMENT_TEMPLATE),
    CATEGORIES: this.createPermission(this.MODULES.CATEGORIES),
    INSTRUCTION: this.createPermission(this.MODULES.INSTRUCTION),
    canRead: [false],
    canWrite: [false],
    canDelete: [false],
  });

  // Create form group for permissions
  createPermission(type: string): FormGroup {
    const permissionGroup = this.fb.group({
      subModuleName: [type],
      canRead: [false],
      canWrite: [false],
      canDelete: [false],
    });

    // Add dynamic behavior for checkbox interactions
    permissionGroup.get('canDelete')?.valueChanges.subscribe((canDelete) => {
      if (this.isPatching) return; // Skip logic if patching
      if (canDelete) {
        permissionGroup.patchValue({ canWrite: true, canRead: true }, { emitEvent: false });
        permissionGroup.controls.canWrite.disable();
        permissionGroup.controls.canRead.disable();
      } else {
        permissionGroup.patchValue({ canWrite: false, canRead: false }, { emitEvent: false });
        permissionGroup.controls.canWrite.enable();
        permissionGroup.controls.canRead.enable();
      }
    });

    permissionGroup.get('canWrite')?.valueChanges.subscribe((canWrite) => {
      if (this.isPatching) return; // Skip logic if patching
      if (canWrite) {
        permissionGroup.patchValue({ canRead: true }, { emitEvent: false });
        permissionGroup.controls.canRead.disable();
      } else {
        permissionGroup.patchValue({ canRead: false }, { emitEvent: false });
        permissionGroup.controls.canRead.enable();
      }
    });

    return permissionGroup;
  }

  // Get form group by name
  getFormGroup(name: string): FormGroup {
    return this.permissionForm.get(name) as FormGroup;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get('id')) {
        this.roleId = params.get('id') ?? '';
        this.onEditPage = true;
        // Simulate role data for editing (replace with hardcoded data if needed)
        this.simulateRoleData();
      }
    });
    this.setupControlListeners();
  }

  // Simulate role data for editing
  simulateRoleData(): void {
    const roleData = {
      roleName: 'Admin',
      selectedBuilding: 'Building A',
      permissions: [
        {
          subModuleName: this.MODULES.TASKS,
          canRead: true,
          canWrite: true,
          canDelete: false,
        },
        { subModuleName: this.MODULES.DASHBOARD, canRead: true, canWrite: false, canDelete: false },
      ],
    };

    this.roleForm.patchValue({
      roleName: roleData.roleName,
      selectedBuilding: roleData.selectedBuilding,
    });

    this.isPatching = true;
    roleData.permissions.forEach((permission) => {
      this.permissionForm.get(permission.subModuleName)?.patchValue(permission);
    });
    this.isPatching = false;
  }

  setupControlListeners(): void {
    this.permissionForm.get('canRead')?.valueChanges.subscribe((isChecked) => {
      if (isChecked) {
        this.enableAllCheckboxes('canRead');
      } else {
        this.disableOtherCheckboxes('canRead');
      }
    });

    this.permissionForm.get('canWrite')?.valueChanges.subscribe((isChecked) => {
      if (isChecked) {
        this.enableAllCheckboxes('canWrite');
        this.permissionForm.controls.canRead.disable();
        this.permissionForm.controls.canRead.patchValue(true);
      } else {
        this.disableOtherCheckboxes('canWrite');
        this.permissionForm.controls.canRead.enable();
        this.permissionForm.controls.canRead.patchValue(false);
      }
    });

    this.permissionForm.get('canDelete')?.valueChanges.subscribe((isChecked) => {
      if (isChecked) {
        this.enableAllCheckboxes('canDelete');
        this.permissionForm.controls.canRead.disable();
        this.permissionForm.controls.canRead.patchValue(true);
        this.permissionForm.controls.canWrite.disable();
        this.permissionForm.controls.canWrite.patchValue(true);
      } else {
        this.disableOtherCheckboxes('canDelete');
        this.permissionForm.controls.canRead.enable();
        this.permissionForm.controls.canRead.patchValue(false);
        this.permissionForm.controls.canWrite.enable();
        this.permissionForm.controls.canWrite.patchValue(false);
      }
    });
  }

  // Disable other checkboxes except the one selected
  disableOtherCheckboxes(selected: 'canRead' | 'canWrite' | 'canDelete'): void {
    const controls = this.permissionForm.controls;
    Object.keys(controls).forEach((control) => {
      if (control !== selected) {
        this.permissionForm.get(control)?.get(selected)?.patchValue(false);
      }
    });
  }

  // Enable all checkboxes except the one selected
  enableAllCheckboxes(selected: 'canRead' | 'canWrite' | 'canDelete'): void {
    const controls = this.permissionForm.controls;
    Object.keys(controls).forEach((control) => {
      if (control !== selected) {
        this.permissionForm.get(control)?.get(selected)?.patchValue(true);
      }
    });
  }

  // Save changes (simulated)
  saveChanges(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }
    this.dataVisible = true;
  }

  // Save data (simulated)
  saveData(): void {
    this.dataVisible = true;
    if (this.onEditPage) {
      this.messageService.add({
        detail: 'The Role has been Successfully Updated.',
        summary: 'success',
      });
    } else {
      this.messageService.add({
        detail: 'The Role has been Successfully Saved.',
        summary: 'success',
      });
    }
    this.router.navigateByUrl('/role-responsibilities');
  }
}
