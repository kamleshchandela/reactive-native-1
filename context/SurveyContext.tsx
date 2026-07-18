import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SurveyLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface SurveyContact {
  name: string;
  phoneNumber: string;
}

export interface Survey {
  id: string;
  siteName: string;
  clientName: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  date: string; // ISO string
  photoUri: string | null;
  photoTimestamp: string | null;
  location: SurveyLocation | null;
  contact: SurveyContact | null;
  notes: string;
  createdAt: string; // ISO string
}

export interface SurveyDraft {
  siteName: string;
  clientName: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  date: Date;
  photoUri: string | null;
  photoTimestamp: string | null;
  location: SurveyLocation | null;
  contact: SurveyContact | null;
  notes: string;
}

interface SurveyContextType {
  surveys: Survey[];
  draft: SurveyDraft;
  editingId: string | null;
  updateDraft: (fields: Partial<SurveyDraft>) => void;
  clearDraft: () => void;
  submitDraft: () => { success: boolean; error?: string; id?: string };
  deleteSurvey: (id: string) => void;
  loadSurveyIntoDraft: (survey: Survey) => void;
}

const initialDraft: SurveyDraft = {
  siteName: '',
  clientName: '',
  description: '',
  priority: 'Medium',
  date: new Date(),
  photoUri: null,
  photoTimestamp: null,
  location: null,
  contact: null,
  notes: '',
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [draft, setDraft] = useState<SurveyDraft>(initialDraft);
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateDraft = (fields: Partial<SurveyDraft>) => {
    setDraft((prev) => ({ ...prev, ...fields }));
  };

  const clearDraft = () => {
    setDraft(initialDraft);
    setEditingId(null);
  };

  const submitDraft = (): { success: boolean; error?: string; id?: string } => {
    // Validation
    if (!draft.siteName.trim()) {
      return { success: false, error: 'Site Name is required' };
    }
    if (!draft.clientName.trim()) {
      return { success: false, error: 'Client Name is required' };
    }
    if (!draft.description.trim()) {
      return { success: false, error: 'Description is required' };
    }

    const targetId = editingId || `SURV-${Date.now()}`;
    const newSurvey: Survey = {
      id: targetId,
      siteName: draft.siteName,
      clientName: draft.clientName,
      description: draft.description,
      priority: draft.priority,
      date: draft.date.toISOString(),
      photoUri: draft.photoUri,
      photoTimestamp: draft.photoTimestamp,
      location: draft.location,
      contact: draft.contact,
      notes: draft.notes,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      // Update existing
      setSurveys((prev) => prev.map((s) => (s.id === editingId ? newSurvey : s)));
    } else {
      // Add new
      setSurveys((prev) => [newSurvey, ...prev]);
    }

    clearDraft();
    return { success: true, id: targetId };
  };

  const deleteSurvey = (id: string) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
  };

  const loadSurveyIntoDraft = (survey: Survey) => {
    setEditingId(survey.id);
    setDraft({
      siteName: survey.siteName,
      clientName: survey.clientName,
      description: survey.description,
      priority: survey.priority,
      date: new Date(survey.date),
      photoUri: survey.photoUri,
      photoTimestamp: survey.photoTimestamp,
      location: survey.location,
      contact: survey.contact,
      notes: survey.notes,
    });
  };

  return (
    <SurveyContext.Provider
      value={{
        surveys,
        draft,
        editingId,
        updateDraft,
        clearDraft,
        submitDraft,
        deleteSurvey,
        loadSurveyIntoDraft,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurveys = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurveys must be used within a SurveyProvider');
  }
  return context;
};
