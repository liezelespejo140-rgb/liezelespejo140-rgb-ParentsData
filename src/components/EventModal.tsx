import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolEvent, ISATUCampus } from '../types';
import { X, Calendar, MapPin, Clock, Users, Bell, Check } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: SchoolEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
}) => {
  const { addSchoolEvent, updateSchoolEvent } = useApp();

  const [title, setTitle] = useState(eventToEdit?.title || '');
  const [description, setDescription] = useState(eventToEdit?.description || '');
  const [category, setCategory] = useState<SchoolEvent['category']>(
    eventToEdit?.category || 'PTA Assembly'
  );
  const [targetAudience, setTargetAudience] = useState<SchoolEvent['targetAudience']>(
    eventToEdit?.targetAudience || 'All Parents'
  );
  const [targetCampus, setTargetCampus] = useState<SchoolEvent['targetCampus']>(
    eventToEdit?.targetCampus || 'All Campuses'
  );
  const [date, setDate] = useState(eventToEdit?.date || '2026-11-15');
  const [time, setTime] = useState(eventToEdit?.time || '09:00 AM - 12:00 PM');
  const [venue, setVenue] = useState(
    eventToEdit?.venue || 'Multi-Purpose Educational Center (MPEC), ISAT U La Paz Campus'
  );
  const [isMandatory, setIsMandatory] = useState(eventToEdit?.isMandatory ?? true);
  const [autoNotify, setAutoNotify] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) {
      alert('Please fill in event title and date.');
      return;
    }

    if (eventToEdit) {
      updateSchoolEvent({
        ...eventToEdit,
        title: title.trim(),
        description: description.trim(),
        category,
        targetAudience,
        targetCampus,
        date,
        time,
        venue: venue.trim(),
        isMandatory,
      });
    } else {
      addSchoolEvent(
        {
          title: title.trim(),
          description: description.trim(),
          category,
          targetAudience,
          targetCampus,
          date,
          time,
          venue: venue.trim(),
          isMandatory,
        },
        autoNotify
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b2545] to-[#133c70] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {eventToEdit ? 'Update University Event' : 'Schedule University Activity / Event'}
              </h3>
              <p className="text-xs text-blue-200">
                Post PTA meetings, academic milestones, and campus activities with automated notification
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event / Activity Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CICT 1st Semester Parent-Adviser Consultation"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                <option value="PTA Assembly">PTA Assembly</option>
                <option value="Academic Calendar">Academic Calendar</option>
                <option value="University Event">University Event</option>
                <option value="Guidance & Counseling">Guidance & Counseling</option>
                <option value="Technology Fair">Technology Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              >
                <option value="All Parents">All Enrolled Parents</option>
                <option value="CICT">CICT Parents Only</option>
                <option value="CEA">CEA Parents Only</option>
                <option value="CIT">CIT Parents Only</option>
                <option value="COE">COE Parents Only</option>
                <option value="CAS">CAS Parents Only</option>
                <option value="Graduating Batch">Graduating Batch Parents</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Schedule
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM - 12:00 PM"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Venue / Location
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. MPEC 3rd Floor / Main Gymnasium"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Agenda
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide agenda details, requirements, dress code, parking advice..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
              <input
                type="checkbox"
                checked={isMandatory}
                onChange={(e) => setIsMandatory(e.target.checked)}
                className="rounded text-[#0b2545]"
              />
              <span>Mandatory Attendance (Required for Semester Clearance)</span>
            </label>

            {!eventToEdit && (
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-blue-900">
                <input
                  type="checkbox"
                  checked={autoNotify}
                  onChange={(e) => setAutoNotify(e.target.checked)}
                  className="rounded text-[#0b2545]"
                />
                <span className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  Automatically dispatch Push Notification & Email update to target parents
                </span>
              </label>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0b2545] hover:bg-[#133c70] text-white px-5 py-2 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-amber-400" />
              {eventToEdit ? 'Save Changes' : 'Publish Event & Notify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
