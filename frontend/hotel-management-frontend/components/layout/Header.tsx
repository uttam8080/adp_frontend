// components/layout/Header.tsx
'use client';

import React from 'react';
import { useHotelStore, PERSONAS } from '@/store/useHotelStore';
import { RoleProfile } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ShieldAlert,
  ChevronDown,
  Sparkles,
  UserCheck,
  Building2,
  Clock,
  Layers
} from 'lucide-react';

const ROLE_LABELS: Record<RoleProfile, { title: string; category: string; color: string }> = {
  task_fulfiller: { title: 'Task Fulfiller (Runner / Attendant)', category: 'Operations', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' },
  department_dispatcher: { title: 'Department Dispatcher', category: 'Coordination', color: 'bg-blue-500/10 text-blue-700 border-blue-300' },
  department_supervisor: { title: 'Department Supervisor (Floor QA)', category: 'Quality Control', color: 'bg-amber-500/10 text-amber-700 border-amber-300' },
  department_manager: { title: 'Department Manager (HOD)', category: 'Management', color: 'bg-purple-500/10 text-purple-700 border-purple-300' },
  front_desk: { title: 'Front Desk Coordinator', category: 'Guest Services', color: 'bg-indigo-500/10 text-indigo-700 border-indigo-300' },
  financial_operator: { title: 'Financial Operator (Audit/Cash)', category: 'Finance', color: 'bg-teal-500/10 text-teal-700 border-teal-300' },
  security_responder: { title: 'Security Responder', category: 'Safety & Emergency', color: 'bg-rose-500/10 text-rose-700 border-rose-300' },
  executive_approver: { title: 'Executive Approver (GM)', category: 'Executive', color: 'bg-yellow-500/10 text-yellow-800 border-yellow-300' },
  platform_admin: { title: 'Platform Administrator (IT)', category: 'System Administration', color: 'bg-slate-500/10 text-slate-800 border-slate-300' },
};

export const Header = () => {
  const { currentRole, currentUser, setRole } = useHotelStore();
  const currentRoleInfo = ROLE_LABELS[currentRole] || ROLE_LABELS.department_dispatcher;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-[#FAF8F5]/90 backdrop-blur-md px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Brand & Scope */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-lg font-bold shadow-sm shrink-0">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-serif font-semibold text-stone-900 tracking-tight leading-none text-base">
                L&apos;Atelier Grand Hotel
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              </div>
              <div className="text-[11px] text-stone-700 flex items-center gap-1.5 mt-1 leading-none">
                <Building2 className="w-3 h-3 text-stone-700 shrink-0" />
                <span>Paris Étoile</span>
                <span className="text-stone-400">•</span>
                <span className="font-medium text-stone-700">{currentUser.scope.department}</span>
              </div>
            </div>
          </div>

          {/* Active Scope Pill */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-stone-200">
            <Badge variant="outline" className="text-xs bg-white text-stone-700 border-stone-200 flex items-center gap-1.5 py-1 px-2.5">
              <Clock className="w-3 h-3 text-stone-500 shrink-0" />
              <span>{currentUser.scope.shift} Shift</span>
            </Badge>
            {currentUser.scope.floor && (
              <Badge variant="outline" className="text-xs bg-white text-stone-700 border-stone-200 flex items-center gap-1.5 py-1 px-2.5">
                <Layers className="w-3 h-3 text-stone-500 shrink-0" />
                <span>Floor {currentUser.scope.floor}</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Emergency Button & Interactive Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Emergency Alert Button */}
          <Button
            variant="destructive"
            size="default"
            className="h-9 px-3 gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-sm transition-transform active:scale-95 flex items-center"
            onClick={() => alert('EMERGENCY DISPATCH: Alerting Security & Duty Manager immediately under Property Emergency Plan.')}
          >
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span className="hidden sm:inline">Emergency Alert</span>
          </Button>

          {/* Role Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="h-9 px-3 gap-2.5 bg-white border border-stone-200 hover:bg-stone-50 shadow-xs inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              <Avatar className="h-6 w-6 border border-stone-200 shrink-0">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-[10px] bg-stone-100 text-stone-700">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-stone-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-stone-500 font-medium leading-tight">
                  {currentRoleInfo.title.split(' (')[0]}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-84 sm:w-92 min-w-[320px] bg-white border-stone-200 shadow-xl p-2 rounded-xl">
              <DropdownMenuLabel className="text-[11px] font-bold text-stone-500 uppercase tracking-wider px-2.5 py-1.5">
                Simulate Role Profile (9 Personas)
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-stone-100 my-1" />

              {(Object.keys(PERSONAS) as RoleProfile[]).map((roleKey) => {
                const user = PERSONAS[roleKey];
                const info = ROLE_LABELS[roleKey];
                const isActive = currentRole === roleKey;

                return (
                  <DropdownMenuItem
                    key={roleKey}
                    onClick={() => setRole(roleKey)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      isActive ? 'bg-amber-50/90 font-medium text-amber-950' : 'hover:bg-stone-50'
                    }`}
                  >
                    <Avatar className="h-8 w-8 border border-stone-200 shrink-0">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs font-semibold">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-stone-900 truncate">
                          {user.name}
                        </span>
                        {isActive && <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">
                        {info.title}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
