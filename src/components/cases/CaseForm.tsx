import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Save, FileText, Calendar, User, AlertCircle } from 'lucide-react';

interface CaseFormProps {
  caseId?: string;
  onBack: () => void;
}

export function CaseForm({ caseId, onBack }: CaseFormProps) {
  const { cases, victims, addCase, updateCase } = useApp();
  const isEditing = !!caseId;
  const caseItem = isEditing ? cases.find(c => c.id === caseId) : null;

  const [formData, setFormData] = useState({
    victimId: '',
    caseType: '',
    incidentDate: '',
    caseSummary: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (caseItem) {
      setFormData({
        victimId: caseItem.victimId,
        caseType: caseItem.caseType,
        incidentDate: caseItem.incidentDate,
        caseSummary: caseItem.caseSummary,
        status: caseItem.status
      });
    }
  }, [caseItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && caseId) {
      updateCase(caseId, formData);
    } else {
      addCase(formData);
    }

    onBack();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Cases
      </button>

      <div className="mb-8">
        <h1 className="text-white text-3xl mb-2">
          {isEditing ? 'Edit Case' : 'Add New Case'}
        </h1>
        <p className="text-slate-400">
          {isEditing ? 'Update case information' : 'Create a new forensic case'}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-2xl">
        {victims.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2 text-yellow-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="mb-1">No victims found</p>
              <p className="text-sm text-yellow-400/80">You need to create a victim record first before creating a case.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="victimId" className="block text-slate-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Select Victim *
            </label>
            <select
              id="victimId"
              name="victimId"
              required
              value={formData.victimId}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a victim...</option>
              {victims.map(victim => (
                <option key={victim.id} value={victim.id}>
                  {victim.name} - {victim.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="caseType" className="block text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Case Type *
            </label>
            <input
              id="caseType"
              name="caseType"
              type="text"
              required
              value={formData.caseType}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Email Compromise, Data Theft, Cyberstalking"
            />
          </div>

          <div>
            <label htmlFor="incidentDate" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Incident Date *
            </label>
            <input
              id="incidentDate"
              name="incidentDate"
              type="date"
              required
              value={formData.incidentDate}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-slate-300 mb-2">
              Case Status *
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label htmlFor="caseSummary" className="block text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Case Summary *
            </label>
            <textarea
              id="caseSummary"
              name="caseSummary"
              required
              value={formData.caseSummary}
              onChange={handleChange}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Provide a detailed summary of the case..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={victims.length === 0}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isEditing ? 'Update Case' : 'Create Case'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
