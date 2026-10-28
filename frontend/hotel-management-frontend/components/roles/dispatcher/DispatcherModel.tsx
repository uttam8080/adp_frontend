// components/roles/dispatcher/DispatchModal.tsx
'use client';

import React, { useState } from 'react';
import { useHotelStore } from '@/store/useHotelStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { HotelTask } from '@/lib/types';

interface DispatchModalProps {
  task: HotelTask | null;
  isOpen: boolean;
  onClose: () => void;
}

// Eligible available staff within scope (Housekeeping / Runners)
const ELIGIBLE_STAFF = [
  { id: 'u-1', name: 'Elena Rostova (Runner - Floor 4)', status: 'Available' },
  { id: 'u-10', name: 'Jean Dupont (Attendant - Floor 3 & 4)', status: 'Available' },
  { id: 'u-11', name: 'Mateo Rossi (Bell Staff - Lobby)', status: 'Available' },
];

export const DispatchModal: React.FC<DispatchModalProps> = ({ task, isOpen, onClose }) => {
  const { assignTask } = useHotelStore();
  const [selectedStaffId, setSelectedStaffId] = useState('');

  if (!task) return null;

  const handleAssign = () => {
    const staff = ELIGIBLE_STAFF.find((s) => s.id === selectedStaffId);
    if (staff) {
      assignTask(task.id, staff.id, staff.name.split(' (')[0]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-stone-200">
        <DialogHeader>
          <DialogTitle className="text-lg font-serif font-bold text-stone-900">
            Dispatch Task to Eligible Staff
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Select an active staff member in the same department and floor scope.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/80 space-y-1 text-xs">
            <div className="font-semibold text-stone-800">{task.title}</div>
            <div className="text-stone-500">{task.roomOrTable} • Priority: {task.priority}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff" className="text-xs font-medium text-stone-700">
              Select Available Assignee
            </Label>
            <Select value={selectedStaffId} onValueChange={(val) => setSelectedStaffId(val ?? '')}>
              <SelectTrigger id="staff" className="w-full bg-white border-stone-200 text-xs">
                <SelectValue placeholder="Choose eligible team member..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-stone-200 text-xs">
                {ELIGIBLE_STAFF.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!selectedStaffId}
            onClick={handleAssign}
            className="text-xs bg-stone-900 hover:bg-stone-800 text-white"
          >
            Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
