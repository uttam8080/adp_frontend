// lib/types.ts

export type RoleProfile =
  | 'task_fulfiller'
  | 'department_dispatcher'
  | 'department_supervisor'
  | 'department_manager'
  | 'front_desk'
  | 'financial_operator'
  | 'security_responder'
  | 'executive_approver'
  | 'platform_admin';

export type Department =
  | 'Housekeeping'
  | 'Food & Beverage'
  | 'Front Office'
  | 'Maintenance'
  | 'Bell Desk'
  | 'Security'
  | 'Finance'
  | 'Executive';

export type TaskStatus = 
  | 'Unassigned' 
  | 'Assigned' 
  | 'In Progress' 
  | 'On the Way' 
  | 'Completed' 
  | 'Blocked' 
  | 'Needs Inspection';

export type Priority = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface UserScope {
  property: string;
  department: Department;
  floor?: number;
  outlet?: string;
  shift: 'Morning' | 'Evening' | 'Night';
}

export interface StaffUser {
  id: string;
  name: string;
  avatar: string;
  profile: RoleProfile;
  scope: UserScope;
}

export interface HotelTask {
  id: string;
  caseId: string;
  title: string;
  description: string;
  department: Department;
  roomOrTable: string;
  guestName: string;
  priority: Priority;
  status: TaskStatus;
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
  slaTargetMinutes: number;
  blockedReason?: string;
  isInspected?: boolean;
}
