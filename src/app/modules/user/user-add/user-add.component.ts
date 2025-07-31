import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api'; // Assuming you're using PrimeNG for notifications

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
  providers: [MessageService], // Add MessageService for toast notifications
})
export class UserAddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  isLoading = false;
  checkingUserName = false;
  checkingEmail = false;
  userId = '';
  onEditPage = false;

  hasAccess = {
    canWrite: true,
  };

  rolesList = [
    { roleId: 1, roleName: 'Admin' },
    { roleId: 2, roleName: 'User' },
    { roleId: 3, roleName: 'Manager' },
  ];

  pocketsList = [
    { pocketID: 101, pocketName: 'Finance' },
    { pocketID: 102, pocketName: 'HR' },
    { pocketID: 103, pocketName: 'IT' },
  ];

  breadcrumbs = [
    { label: 'User', url: '/user/user-list' },
    { label: 'New User Creation', url: '/' },
  ];

  // Static data for form
  staticData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    userName: 'johndoe',
    passwordHash: 'Password123!',
  };

  staticUserDetail = {
    userName: 'Darshan',
  };

  staticViewUserDetail = {
    userName: 'Pratik',
  };

  // Form Initialization
  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    userName: ['', Validators.required],
    passwordHash: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
      ],
    ],
    isActive: [true],
    roles: this.fb.array([]), // Initially empty; roles can be added dynamically
  });

  ngOnInit() {
    // Set initial form values from static data
    this.userForm.patchValue(this.staticData);
  }

  // Create a new role group
  createRoleGroup(): FormGroup {
    return this.fb.group({
      roleID: ['', Validators.required],
      pocketID: [[], Validators.required],
    });
  }

  // Get roles as FormArray
  get roles(): FormArray {
    return this.userForm.get('roles') as FormArray;
  }

  // Add a new role
  addRole(): void {
    this.roles.push(this.createRoleGroup());
  }

  // Remove a role
  removeRole(index: number): void {
    this.roles.removeAt(index);
  }

  // Remove pocket
  onChangePocket(event: any, index: number): void {
    if (typeof event.itemValue === 'object') return;

    const pocketID = event.itemValue;
    const rolesArray = this.userForm.get('roles') as FormArray;
    const roleGroup = rolesArray.at(index) as FormGroup;
    const pocketIds = roleGroup.get('pocketID')?.value || [];

    // Check if pocketID exists in the current role's pocketIDs
    if (pocketIds.includes(pocketID)) {
      // Remove pocketID from the array
      const updatedPockets = pocketIds.filter((id: number) => id !== pocketID);
      roleGroup.patchValue({ pocketID: updatedPockets });

      console.log(`Pocket ${pocketID} removed from role at index ${index}`);

      this.messageService.add({
        detail: 'Pocket removed successfully (static)',
        summary: 'Success',
        severity: 'success',
      });
    }
  }
  draftVisible: boolean = false;
  // Show Save Dialog
  showSaveDialog(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    console.log('Form Submitted', this.userForm.value);
    this.draftVisible = true;
  }
  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true;
      
      setTimeout(() => {
        console.log("Static User Data Saved:", this.userForm.value);
        this.isLoading = false;
      }, 1000); // Simulating a delay to mimic an API call
      
      this.draftVisible = false; // Closing the dialog after submission
    } else {
      this.userForm.markAllAsTouched();
    }
  }
  
}
