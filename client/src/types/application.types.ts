

export type Team =
  | "Technical Team"
  | "Design Team"
  | "Dev Team"
  | "E-sports Team"
  | "Logistic Team"
  | "VideoEditing Team"
  | "PR-Outreach Team"
  | "SocialMedia Team"
  | "Editorial Team";

  
export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected";

export interface ApplyApplicationPayload {
  rollNo: string;              
  MobileNo: string;
  preference1: Team;
  preference2: Team;
  preference3: Team;
  reason: string;
  skills: string[];           
  OtherClubs?: string[];       
}

export interface Application {
  _id: string;
  user: {
    _id :string
    name:string
  };              
  rollNo: string;
  MobileNo: string;
  preference1: Team;
  preference2: Team;
  preference3: Team;
  skills: string[];
  OtherClubs?: string[];
  reason: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}



export interface UpdateApplicationStatusPayload {
  userId: string;
  newStatus: ApplicationStatus;
}


export interface ApplicationResponse {
  success: boolean;
  application: Application;
}

export interface ApplicationsResponse {
  success: boolean;
  forms: Application[];
}

export interface StatusResponse {
  success: boolean;
  status: ApplicationStatus;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
