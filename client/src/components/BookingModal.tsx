import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, User, Users, Info } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: any;
  selectedSchedule: any;
  onConfirm: (date: Date) => void;
  isLoading: boolean;
  formatTime: (time: string) => string;
  getDayName: (day: number) => string;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedClass,
  selectedSchedule,
  onConfirm,
  isLoading,
  formatTime,
  getDayName,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  if (!selectedClass || !selectedSchedule) {
    return null;
  }

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Book Class
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Class Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedClass.name}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{selectedClass.instructor?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {getDayName(selectedSchedule.dayOfWeek)}s at{" "}
                  {formatTime(selectedSchedule.startTime)} - {formatTime(selectedSchedule.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{selectedClass.duration} minutes</span>
              </div>
            </div>
            <div className="mt-3">
              <Badge 
                className={
                  selectedClass.intensity === 'high' 
                    ? 'bg-red-100 text-red-800'
                    : selectedClass.intensity === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }
              >
                {selectedClass.intensity} intensity
              </Badge>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Select Date
            </Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Member Login Required
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  You need to be logged in to book classes. We'll redirect you to login after confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500"
              onClick={handleConfirm}
              disabled={!selectedDate || isLoading}
            >
              {isLoading ? "Booking..." : "Book Class"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
