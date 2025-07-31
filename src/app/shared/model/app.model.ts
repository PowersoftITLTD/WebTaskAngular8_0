export interface Task_Add {
  Mode: string;
  Task_No: string;
  Task_Name: string;
  Task_Description: string;
  Category: number;
  Project_Id: number;
  Subproject_Id: number;
  Completion_Date: string;
  Assigned_To: string;
  Task_Type: number;
  Tags: string;
  Isnode: string;
  Approver_Id: number;
  Start_Date: string;
  Close_Date: string;
  Due_Date: string;
  Task_Parent_Id: string;
  Status: string;
  Status_Perc: string;
  Task_Created_By: number;
  Is_Archive: string;
  Attribute1: string;
  Attribute2: string;
  Attribute3: string;
  Attribute4: string;
  Attribute5: string;
  Created_By: number;
  Creation_Date: string;
  Approve_Action_Date: any;
  Session_User_ID: string;
  Business_Group_ID: string;
  Priority: string;
  Tentative_Start_Date: string | null;
  Tentative_End_Date: string | null;
  Actual_Start_Date: string | null;
  Actual_End_Date: string | null;
  Delete_Flag: string;
  Task_Checklist: TaskChecklist[];
  Task_Endlist: TaskEndlist[];
  Task_Sanctioning: TaskSanctioning[];
  Task_Parent_Number?: any;
  Current_task_mkey?: number;
  Task_Parent_Node_Id?: number;
}

export interface TaskChecklist {
  Task_Mkey: number;
  Sr_No: number;
  Doc_Mkey: number;
  Document_Category: number;
  Delete_Flag: string;
  Created_By: string;
}

export interface TaskEndlist {
  Mkey: number;
  Sr_No: number;
  Output_Doc_List: OutputDocList;
  Created_By: string;
  Delete_Flag: string;
}

export interface OutputDocList {
  'Land Related Documents': string;
}

export interface TaskSanctioning {
  Mkey: number;
  Sr_No: number;
  Level: number;
  Sanctioning_Department: string;
  Sanctioning_Authority_Mkey: string;
  Created_By: number;
  Status: string;
  Delete_Flag: string;
}
