// store/useHotelStore.ts
import { create } from 'zustand';
import { RoleProfile, HotelTask, StaffUser, TaskStatus } from '@/lib/types';

export const PERSONAS: Record<RoleProfile, StaffUser> = {
  task_fulfiller: {
    id: 'u-1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    profile: 'task_fulfiller',
    scope: { property: 'Grand Atelier', department: 'Housekeeping', floor: 4, shift: 'Morning' }
  },
  department_dispatcher: {
    id: 'u-2',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    profile: 'department_dispatcher',
    scope: { property: 'Grand Atelier', department: 'Housekeeping', shift: 'Morning' }
  },
  department_supervisor: {
    id: 'u-3',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    profile: 'department_supervisor',
    scope: { property: 'Grand Atelier', department: 'Housekeeping', shift: 'Morning' }
  },
  department_manager: {
    id: 'u-4',
    name: 'Chef Antoine Laurent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    profile: 'department_manager',
    scope: { property: 'Grand Atelier', department: 'Food & Beverage', shift: 'Morning' }
  },
  front_desk: {
    id: 'u-5',
    name: 'Chloe Monet',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    profile: 'front_desk',
    scope: { property: 'Grand Atelier', department: 'Front Office', shift: 'Morning' }
  },
  financial_operator: {
    id: 'u-6',
    name: 'Julian Vance',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    profile: 'financial_operator',
    scope: { property: 'Grand Atelier', department: 'Finance', shift: 'Morning' }
  },
  security_responder: {
    id: 'u-7',
    name: 'Captain David Briggs',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    profile: 'security_responder',
    scope: { property: 'Grand Atelier', department: 'Security', shift: 'Morning' }
  },
  executive_approver: {
    id: 'u-8',
    name: 'Victoria Stirling (GM)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    profile: 'executive_approver',
    scope: { property: 'Grand Atelier', department: 'Executive', shift: 'Morning' }
  },
  platform_admin: {
    id: 'u-9',
    name: 'Vikram Patel (IT)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    profile: 'platform_admin',
    scope: { property: 'Grand Atelier', department: 'Executive', shift: 'Morning' }
  }
};

interface HotelStoreState {
  currentRole: RoleProfile;
  currentUser: StaffUser;
  tasks: HotelTask[];
  setRole: (role: RoleProfile) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, note?: string) => void;
  assignTask: (taskId: string, staffId: string, staffName: string) => void;
}

export const useHotelStore = create<HotelStoreState>((set) => ({
  currentRole: 'department_dispatcher',
  currentUser: PERSONAS['department_dispatcher'],
  tasks: [
    {
      id: 'TSK-101',
      caseId: 'CASE-401',
      title: 'Deliver Extra Egyptian Cotton Towels',
      description: 'Guest requested 3 bath towels and 2 hand towels.',
      department: 'Housekeeping',
      roomOrTable: 'Room 402 (Deluxe Suite)',
      guestName: 'Lady Eleanor Vance',
      priority: 'High',
      status: 'Assigned',
      assigneeId: 'u-1',
      assigneeName: 'Elena Rostova',
      createdAt: '10 mins ago',
      slaTargetMinutes: 20,
    },
    {
      id: 'TSK-102',
      caseId: 'CASE-402',
      title: 'In-Room Dining: Late Night Truffle Pasta',
      description: '1x Truffle Fettuccine, 1x San Pellegrino. Allergy: Peanuts.',
      department: 'Food & Beverage',
      roomOrTable: 'Room 310',
      guestName: 'Mr. David Sterling',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: '15 mins ago',
      slaTargetMinutes: 30,
    },
    {
      id: 'TSK-103',
      caseId: 'CASE-403',
      title: 'AC Leaking & Thermostat Failure',
      description: 'Water dripping near closet. Need immediate technician.',
      department: 'Maintenance',
      roomOrTable: 'Room 508',
      guestName: 'Sophia Lorenzi',
      priority: 'Emergency',
      status: 'Unassigned',
      createdAt: '5 mins ago',
      slaTargetMinutes: 15,
    }
  ],
  setRole: (role) => set({ currentRole: role, currentUser: PERSONAS[role] }),
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t))
    })),
  assignTask: (taskId, staffId, staffName) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'Assigned', assigneeId: staffId, assigneeName: staffName } : t
      )
    }))
}));
