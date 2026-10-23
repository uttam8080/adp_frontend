// components/roles/fulfiller/FulfillerActionModal.tsx
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { HotelTask, TaskStatus } from '@/lib/types';
import { AlertCircle, CheckCircle, Navigation } from 'lucide-react';

interface FulfillerActionModalProps {
  task: HotelTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FulfillerActionModal: React.FC<FulfillerActionModalProps> = ({ task, isOpen, onClose }) => {
  const { updateTaskStatus } = useHotelStore();
  const [blockerReason, setBlockerReason] = useState('');
  const [actionType, setActionType] = useState<TaskStatus | null>(null);

  if (!task) return null;

  const handleConfirm = () => {
    if (actionType) {
      updateTaskStatus(task.id, actionType, blockerReason);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] bg-white border-stone-200">
        <DialogHeader>
          <DialogTitle className="text-lg font-serif font-bold text-stone-900">
            Update Task Execution
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            {task.roomOrTable} • {task.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Quick Status Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={actionType === 'On the Way' ? 'default' : 'outline'}
              className={`h-16 flex-col text-xs gap-1 border-stone-200 ${
                actionType === 'On the Way' ? 'bg-blue-600 text-white' : ''
              }`}
              onClick={() => setActionType('On the Way')}
            >
              <Navigation className="w-4 h-4" />
              On the Way
            </Button>

            <Button
              type="button"
              variant={actionType === 'Completed' ? 'default' : 'outline'}
              className={`h-16 flex-col text-xs gap-1 border-stone-200 ${
                actionType === 'Completed' ? 'bg-emerald-600 text-white' : ''
              }`}
              onClick={() => setActionType('Completed')}
            >
              <CheckCircle className="w-4 h-4" />
              Completed
            </Button>

            <Button
              type="button"
              variant={actionType === 'Blocked' ? 'destructive' : 'outline'}
              className="h-16 flex-col text-xs gap-1 border-stone-200"
              onClick={() => setActionType('Blocked')}
            >
              <AlertCircle className="w-4 h-4" />
              Blocked
            </Button>
          </div>

          {actionType === 'Blocked' && (
            <div className="space-y-1.5 animate-fadeIn">
              <Label className="text-xs font-medium text-stone-700">
                Reason for Blocker (DND, Guest Unavailable, Shortage)
              </Label>
              <Input
                placeholder="e.g., Do Not Disturb sign active on door"
                value={blockerReason}
                onChange={(e) => setBlockerReason(e.target.value)}
                className="text-xs border-stone-200 bg-white"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!actionType || (actionType === 'Blocked' && !blockerReason.trim())}
            onClick={handleConfirm}
            className="text-xs bg-stone-900 hover:bg-stone-800 text-white"
          >
            Save Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
