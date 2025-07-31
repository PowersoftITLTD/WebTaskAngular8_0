import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrl: './add-document.component.scss',
})
export class AddDocumentComponent {
  @Input() sidebarVisible: boolean = false;
  @Output() sidebarHide = new EventEmitter();
  date2: Date | undefined; 
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFileNames: string = '';
  onSidebarHide() {
    this.sidebarHide.emit();
  }
  onCancel() {
    this.sidebarVisible = false;
  }

  onSave() {
    console.log('Project added', this.projectForm.value);
  }
  projectForm: FormGroup;
  uploadedFiles: any[] = [];
  properties = [
    { label: 'Hubtown countrywood', value: 'Hubtown countrywood' },
    { label: 'Other Property', value: 'Other Property' },
  ];

  buildings = [
    { label: 'KONDWA NANO - BLDG R', value: 'KONDWA NANO - BLDG R' },
    { label: 'Other Building', value: 'Other Building' },
  ];

  documents = [
    { label: 'Pan Card', value: 'Pan Card' },
    { label: 'Aadhar Card', value: 'Aadhar Card' },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    this.projectForm = this.fb.group({
      property: [this.properties[0].value],
      building: [this.buildings[0].value],
      document: [this.documents[0].value],
      panNumber: ['ABC89930P'],
      issuingDate: [new Date('1990-02-12')],
    });
  }
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.selectedFileNames = Array.from(files).map((file: any) => file.name).join(', ');
    }
  }
  triggerFileUpload() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }  
}
