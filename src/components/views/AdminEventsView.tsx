import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolEvent } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bell,
  Plus,
  Send,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AdminEventsViewProps {
  onOpenEventModal: (event?: SchoolEvent | null) => void;
  onSendEventBroadcast: (event: SchoolEvent) => void;
}

export const AdminEventsView: React.FC<AdminEventsViewProps> = ({
  onOpenEventModal,
  onSendEventBroadcast,
}) => {
  const { events, deleteSchoolEvent, toggleEventRSVP } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEvents = events.filter((e) => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Upcoming Activities & School Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish institutional events, GPTA assemblies, and exams with automated push notifications and email updates
          </p>
        </div>

        <button
          onClick={() => onOpenEventModal(null)}
          className="px-4 py-2 bg-[#0b2545] hover:bg-[#133c70] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          Schedule New Event
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {(
          [
            'all',
            'PTA Assembly',
            'Academic Calendar',
            'University Event',
            'Guidance & Counseling',
          ] as const
        ).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#0b2545] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Activities' : cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            No events found in this category.
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {event.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1.5 leading-snug">
                      {event.title}
                    </h3>
                  </div>
                  {event.isMandatory && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded shrink-0">
                      Mandatory
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-900 tabular-nums">{event.date}</span>
                    <span className="text-slate-400">·</span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Target: <strong>{event.targetAudience}</strong></span>
                  </div>
                </div>

                {/* Automated Notification Status */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {event.notificationSent ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-slate-700 font-medium">
                          Alerts Dispatched ({event.rsvpCount} RSVPs Confirmed)
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-slate-600">Pending Broadcast</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => toggleEventRSVP(event.id)}
                    className="text-[11px] font-semibold text-blue-700 hover:text-blue-900"
                  >
                    + Add RSVP
                  </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSendEventBroadcast(event)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Push & Email
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenEventModal(event)}
                    title="Edit Event"
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove event "${event.title}"?`)) {
                        deleteSchoolEvent(event.id);
                      }
                    }}
                    title="Delete Event"
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
