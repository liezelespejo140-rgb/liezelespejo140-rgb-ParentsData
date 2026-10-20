import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PushNotificationToast } from './components/PushNotificationToast';
import { LoginModal } from './components/LoginModal';
import { ParentIntakeModal } from './components/ParentIntakeModal';
import { ParentDetailModal } from './components/ParentDetailModal';
import { NotificationDispatchModal } from './components/NotificationDispatchModal';
import { EventModal } from './components/EventModal';
import { GuidanceClearanceModal } from './components/GuidanceClearanceModal';
import { CounselingLogModal } from './components/CounselingLogModal';
import { InvolvementLogModal } from './components/InvolvementLogModal';
import { ConsultationModal } from './components/ConsultationModal';
import { QFPAR01PrintModal } from './components/QFPAR01PrintModal';

import { ParentDashboardView } from './components/views/ParentDashboardView';
import { AdminParentsView } from './components/views/AdminParentsView';
import { AdminGuidanceView } from './components/views/AdminGuidanceView';
import { AdminEventsView } from './components/views/AdminEventsView';
import { AdminNotificationsView } from './components/views/AdminNotificationsView';
import { ConsultationsView } from './components/views/ConsultationsView';
import { ParentInvolvementView } from './components/views/ParentInvolvementView';
import { NeedsAssessmentView } from './components/views/NeedsAssessmentView';
import { SMSNotificationView } from './components/views/SMSNotificationView';
import { ISOEvaluationView } from './components/views/ISOEvaluationView';

import { Parent, Student, SchoolEvent } from './types';

const MainLayout: React.FC = () => {
  const { activeView } = useApp();

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isInvolvementLogOpen, setIsInvolvementLogOpen] = useState(false);
  const [isGuidanceClearanceOpen, setIsGuidanceClearanceOpen] = useState(false);
  const [isCounselingLogOpen, setIsCounselingLogOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isPrintQFPAR01Open, setIsPrintQFPAR01Open] = useState(false);

  // Modal active targets
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedStudentForGuidance, setSelectedStudentForGuidance] = useState<Student | null>(null);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState<SchoolEvent | null>(null);
  const [broadcastTargetParent, setBroadcastTargetParent] = useState<Parent | null>(null);
  const [broadcastTargetEvent, setBroadcastTargetEvent] = useState<SchoolEvent | null>(null);
  const [printParent, setPrintParent] = useState<Parent | null>(null);
  const [printStudent, setPrintStudent] = useState<Student | null>(null);

  const handleOpenParentDetail = (parent: Parent) => {
    setSelectedParent(parent);
  };

  const handleOpenPrintQFPAR01 = (parent: Parent, student: Student | null) => {
    setPrintParent(parent);
    setPrintStudent(student);
    setIsPrintQFPAR01Open(true);
  };

  const handleOpenLogModal = (parent: Parent) => {
    setSelectedParent(parent);
    setIsInvolvementLogOpen(true);
  };

  const handleOpenGuidanceClearance = (student: Student) => {
    setSelectedStudentForGuidance(student);
    setIsGuidanceClearanceOpen(true);
  };

  const handleOpenCounselingLog = (student: Student) => {
    setSelectedStudentForGuidance(student);
    setIsCounselingLogOpen(true);
  };

  const handleSendDirectAlert = (parent: Parent) => {
    setBroadcastTargetParent(parent);
    setBroadcastTargetEvent(null);
    setIsBroadcastOpen(true);
  };

  const handleSendEventBroadcast = (event: SchoolEvent) => {
    setBroadcastTargetEvent(event);
    setBroadcastTargetParent(null);
    setIsBroadcastOpen(true);
  };

  const handleOpenConsultation = (student?: Student) => {
    if (student) setSelectedStudentForGuidance(student);
    setIsConsultationOpen(true);
  };

  const handleOpenEventModal = (event?: SchoolEvent | null) => {
    setSelectedEventToEdit(event || null);
    setIsEventModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Push notification toast overlay */}
      <PushNotificationToast />

      {/* University Top Header */}
      <Navbar
        onOpenLoginModal={() => setIsLoginOpen(true)}
        onOpenIntakeModal={() => setIsIntakeOpen(true)}
        onOpenBroadcastModal={() => {
          setBroadcastTargetParent(null);
          setBroadcastTargetEvent(null);
          setIsBroadcastOpen(true);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 lg:pb-8">
        {/* Render active view based on state and role */}
        {activeView === 'dashboard' && (
          <ParentDashboardView
            onOpenGuidanceClearance={handleOpenGuidanceClearance}
            onOpenConsultationModal={handleOpenConsultation}
            onOpenPrintModal={handleOpenPrintQFPAR01}
          />
        )}

        {activeView === 'involvement' && <ParentInvolvementView />}

        {activeView === 'parents' && (
          <AdminParentsView
            onSelectParent={handleOpenParentDetail}
            onOpenIntakeModal={() => setIsIntakeOpen(true)}
            onOpenLogModal={handleOpenLogModal}
            onSendAlert={handleSendDirectAlert}
            onOpenPrintModal={handleOpenPrintQFPAR01}
          />
        )}

        {activeView === 'needs_assessment' && (
          <NeedsAssessmentView
            onOpenBroadcastModalWithFilter={() => {
              setBroadcastTargetParent(null);
              setBroadcastTargetEvent(null);
              setIsBroadcastOpen(true);
            }}
          />
        )}

        {activeView === 'sms_gateway' && <SMSNotificationView />}

        {activeView === 'iso_evaluation' && <ISOEvaluationView />}

        {activeView === 'academics' && (
          <AdminGuidanceView
            onOpenGuidanceClearance={handleOpenGuidanceClearance}
            onOpenCounselingLog={handleOpenCounselingLog}
            onOpenBroadcastModal={() => {
              setBroadcastTargetParent(null);
              setBroadcastTargetEvent(null);
              setIsBroadcastOpen(true);
            }}
          />
        )}

        {activeView === 'events' && (
          <AdminEventsView
            onOpenEventModal={handleOpenEventModal}
            onSendEventBroadcast={handleSendEventBroadcast}
          />
        )}

        {activeView === 'notifications' && (
          <AdminNotificationsView
            onOpenBroadcastModal={() => {
              setBroadcastTargetParent(null);
              setBroadcastTargetEvent(null);
              setIsBroadcastOpen(true);
            }}
          />
        )}

        {activeView === 'consultations' && (
          <ConsultationsView onOpenConsultationModal={handleOpenConsultation} />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 mb-14 lg:mb-0 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-amber-400 p-0.5">
              <img
                src="/src/assets/images/regenerated_image_1792137891214.png"
                alt="ISAT U"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="font-bold text-slate-800">
                Iloilo Science and Technology University (ISAT U)
              </div>
              <div className="text-[11px] text-slate-500">
                Burgos Street, La Paz, Iloilo City, 5000, Western Visayas, Philippines
              </div>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400">
            <div>Parent Link & Guidance Monitoring System · ISAT U Guidance and Counseling Center</div>
            <div className="mt-0.5">
              AACCUP Level IV Accredited · ISO 9001:2015 Certified · CHED Center of Development
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <ParentIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
      />

      <ParentDetailModal
        parent={selectedParent}
        onClose={() => setSelectedParent(null)}
        onOpenLogModal={(parent) => {
          setSelectedParent(parent);
          setIsInvolvementLogOpen(true);
        }}
        onOpenGuidanceClearance={handleOpenGuidanceClearance}
        onOpenPrintQFPAR01={handleOpenPrintQFPAR01}
        onSendDirectNotification={handleSendDirectAlert}
      />

      <NotificationDispatchModal
        isOpen={isBroadcastOpen}
        onClose={() => {
          setIsBroadcastOpen(false);
          setBroadcastTargetParent(null);
          setBroadcastTargetEvent(null);
        }}
        initialParent={broadcastTargetParent}
        initialEvent={broadcastTargetEvent}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEventToEdit(null);
        }}
        eventToEdit={selectedEventToEdit}
      />

      <GuidanceClearanceModal
        student={selectedStudentForGuidance}
        onClose={() => {
          setIsGuidanceClearanceOpen(false);
          setSelectedStudentForGuidance(null);
        }}
      />

      <CounselingLogModal
        isOpen={isCounselingLogOpen}
        onClose={() => setIsCounselingLogOpen(false)}
        targetStudent={selectedStudentForGuidance}
      />

      <InvolvementLogModal
        isOpen={isInvolvementLogOpen}
        onClose={() => setIsInvolvementLogOpen(false)}
        targetParent={selectedParent}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        linkedStudent={selectedStudentForGuidance}
      />

      {isPrintQFPAR01Open && (
        <QFPAR01PrintModal
          parent={printParent}
          student={printStudent}
          onClose={() => {
            setIsPrintQFPAR01Open(false);
            setPrintParent(null);
            setPrintStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
