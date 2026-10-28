// components/layout/RoleBanner.tsx
'use client';

import React from 'react';
import { useHotelStore } from '@/store/useHotelStore';
import { RoleProfile } from '@/lib/types';
import { ShieldCheck, ShieldX, Info } from 'lucide-react';

interface BoundaryConfig {
  purpose: string;
  allowed: string[];
  restricted: string[];
  reportingTo: string;
}

const ROLE_BOUNDARIES: Record<RoleProfile, BoundaryConfig> = {
  task_fulfiller: {
    purpose: 'Deliver assigned services and accurately record progress.',
    allowed: [
      'View assigned tasks & room/guest instructions',
      'Update status: In Progress, On the Way, Completed, Blocked',
      'Attach completion notes & approved photo proof'
    ],
    restricted: [
      'Cannot view guest folios or financial balances',
      'Cannot reassign tasks to colleagues',
      'Cannot override room safety or entry restrictions'
    ],
    reportingTo: 'Department Supervisor'
  },
  department_dispatcher: {
    purpose: 'Organize incoming work and assign eligible staff within scope.',
    allowed: [
      'View department queue, deadlines, staff availability',
      'Create and categorize tasks; link departmental subtasks',
      'Assign & schedule work to active runners/attendants',
      'Send approved guest updates and monitor SLAs'
    ],
    restricted: [
      'Cannot approve compensation or fee waivers',
      'Cannot override prices or modify POS checks',
      'Cannot reset original ticket timers to conceal delays'
    ],
    reportingTo: 'Department Supervisor / Manager'
  },
  department_supervisor: {
    purpose: 'Control shift execution, service quality, and staff oversight.',
    allowed: [
      'Reassign team tasks and arrange shift backup coverage',
      'Inspect completed work, reopen incomplete tasks',
      'Manage access blockers, linen/supply shortages',
      'Document shift handover log'
    ],
    restricted: [
      'Cannot issue unrestricted refunds',
      'Cannot release uninspected/unsafe rooms without PMS clearance'
    ],
    reportingTo: 'Department Manager'
  },
  department_manager: {
    purpose: 'Own department standards, SLA performance, and complaints.',
    allowed: [
      'View department-wide metrics, SLA breaches, staff performance',
      'Resolve complaints & approve recovery within delegated limit',
      'Manage shift coverage and service schedules'
    ],
    restricted: [
      'No platform administrative access or raw DB access',
      'No unrestricted financial transaction approvals'
    ],
    reportingTo: 'Director of Rooms / Hotel Manager'
  },
  front_desk: {
    purpose: 'Maintain guest cases, reservation sync, and room moves.',
    allowed: [
      'Create/retrieve bookings, check-in/out, key card issuance',
      'Capture guest requests and route to department queues',
      'Coordinate room moves & trigger guest-session revocation',
      'Initiate charge disputes and refund requests'
    ],
    restricted: [
      'Cannot bypass guest identity verification',
      'Cannot apply arbitrary discounts without manager sign-off',
      'No access to raw security incident evidence'
    ],
    reportingTo: 'Front Office Manager'
  },
  financial_operator: {
    purpose: 'Perform approved financial actions with four-eyes review controls.',
    allowed: [
      'View/explain folios, collect deposits, reconcile settlements',
      'Execute approved adjustments within amount threshold',
      'Run night audit and investigate payment gateway failures'
    ],
    restricted: [
      'Strict segregation: Cannot self-approve own refund requests',
      'No access to raw, unmasked credit card credentials'
    ],
    reportingTo: 'Financial Controller'
  },
  security_responder: {
    purpose: 'Respond to safety/security incidents and maintain restricted logs.',
    allowed: [
      'Receive immediate emergency & intrusion alerts',
      'Acknowledge, attend, request police/medical backup',
      'Preserve restricted incident evidence and chain of custody'
    ],
    restricted: [
      'Cannot access unrelated guest folios or room reservations',
      'Cannot delete audit or incident evidence logs',
      'Cannot approve compensation or guest refunds'
    ],
    reportingTo: 'Security Manager'
  },
  executive_approver: {
    purpose: 'Hotel-wide oversight, KPI tracking, and high-tier approvals.',
    allowed: [
      'Review operational performance and revenue summaries',
      'Approve high-threshold financial disputes & major recovery',
      'Review major incidents, handover logs, and access certifications'
    ],
    restricted: [
      'Cannot bypass property safety/emergency protocols',
      'No silent administrative privileges or direct DB changes'
    ],
    reportingTo: 'General Manager / Regional VP'
  },
  platform_admin: {
    purpose: 'Maintain user access, role scopes, QR mappings, and system health.',
    allowed: [
      'Provision/deactivate accounts, assign scopes & shifts',
      'Configure room/table QR codes and session revocation rules',
      'Monitor integrations (PMS/POS/Resend) and retry failures'
    ],
    restricted: [
      'Technical access gives NO refund or compensation authority',
      'Cannot silently impersonate guest or staff accounts',
      'Cannot delete immutable audit logs'
    ],
    reportingTo: 'Head of IT / Hotel GM'
  }
};

export const RoleBanner = () => {
  const { currentRole, currentUser } = useHotelStore();
  const boundary = ROLE_BOUNDARIES[currentRole] || ROLE_BOUNDARIES.department_dispatcher;

  return (
    <div className="bg-stone-50 border border-stone-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3.5 border-b border-stone-200">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
              Active Simulation Persona
            </span>
            <span className="text-sm font-serif font-bold text-stone-900">
              {currentUser.name}
            </span>
            <span className="text-xs text-stone-500">
              ({currentUser.scope.department} • {currentUser.scope.shift} Shift)
            </span>
          </div>
          <p className="text-xs text-stone-600 flex items-center gap-1.5 pt-0.5">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>{boundary.purpose}</span>
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 text-xs border border-stone-200 shrink-0">
          <span>Reports to:</span>
          <span className="font-semibold text-stone-900">{boundary.reportingTo}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3.5 text-xs">
        {/* Permitted */}
        <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Authorized Permissions</span>
          </div>
          <ul className="space-y-1.5 pl-5 list-disc text-stone-700 marker:text-emerald-500">
            {boundary.allowed.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>

        {/* Boundary Limits */}
        <div className="bg-rose-50/50 border border-rose-200/60 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-rose-900">
            <ShieldX className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Access Boundaries & Restrictions</span>
          </div>
          <ul className="space-y-1.5 pl-5 list-disc text-stone-700 marker:text-rose-500">
            {boundary.restricted.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
