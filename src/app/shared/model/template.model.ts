export interface Subtask {
  seQ_NO: string;
  subtasK_ABBR: string;
  subtasK_MKEY: number;
}

export interface SanctioningDepartment {
  LEVEL: string;
  SANCTIONING_DEPARTMENT: string;
  SANCTIONING_AUTHORITY: string;
  START_DATE: string; // ISO 8601 date string
  END_DATE: string;   // ISO 8601 date string
}

export interface DocumentList {
  [key: string]: string;
}

export interface TemplateInterface {
  Mkey: number;
  Building_Type: number;
  Building_Standard: number;
  Statutory_Authority: number;
  Main_Abbr: string;
  Short_Description: string;
  Long_Description: string;
  Authority_Department: number;
  Resposible_Emp_Mkey: number;
  Job_Role: number;
  Tags: string;
  Days_Requierd: number;
  Seq_Order: string;
  Created_By: number;
  End_Result_Doc_Lst: DocumentList;
  Checklist_Doc_Lst: DocumentList;
  Subtask_List: Subtask[];
  Sanctioning_Department_List: SanctioningDepartment[];
  Session_User_Id: number;
  Business_Group_Id: number;
}
