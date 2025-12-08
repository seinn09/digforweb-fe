import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Save, Activity, User, Clock, FileText, AlertCircle } from 'lucide-react';

interface ActionFormProps {
  actionId?: string;
  onBack: () => void;
}

const FORENSIC_STAGES = [
  'Identification',
  'Preservation',
  'Collection',
  'Examination',
  'Documentation',
  'Presentation'
];

export function ActionForm({ actionId, onBack }: ActionFormProps) {
  const { forensicActions, cases, addForensicAction, updateForensicAction } = useApp();
  const isEditing = !!actionId;
  const action = isEditing ? forensicActions.find(a => a.id === actionId) : null;

  const [formData, setFormData] = useState({
    caseId: '',
    forensicStage: '',
    actionDescription: '',
    executionTime: '',
    pic: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (action) {
      setFormData({
        caseId: action.caseId,
        forensicStage: action.forensicStage,
        actionDescription: action.actionDescription,
        executionTime: action.executionTime,
        pic: action.pic,
        status: action.status
      });
    } else {
      // Set default execution time to now
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setFormData(prev => ({ ...prev, executionTime: localDateTime }));
    }
  }, [action]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      executionTime: new Date(formData.executionTime).toISOString()
    };

    if (isEditing && actionId) {
      updateForensicAction(actionId, submissionData);
    } else {
      addForensicAction(submissionData);
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
        Back to Forensic Actions
      </button>

      <div className="mb-8">
        <h1 className="text-white text-3xl mb-2">
          {isEditing ? 'Edit Forensic Action' : 'Add New Forensic Action'}
        </h1>
        <p className="text-slate-400">
          {isEditing ? 'Update forensic action information' : 'Record a new forensic investigation action'}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-2xl">
        {cases.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2 text-yellow-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="mb-1">No cases found</p>
              <p className="text-sm text-yellow-400/80">You need to create a case first before adding forensic actions.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="caseId" className="block text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Select Case *
            </label>
            <select
              id="caseId"
              name="caseId"
              required
              value={formData.caseId}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a case...</option>
              {cases.map(caseItem => (
                <option key={caseItem.id} value={caseItem.id}>
                  {caseItem.caseType} - {caseItem.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="forensicStage" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Forensic Stage *
            </label>
            <select
              id="forensicStage"
              name="forensicStage"
              required
              value={formData.forensicStage}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a stage...</option>
              {FORENSIC_STAGES.map(stage => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pic" className="block text-slate-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Person In Charge (PIC) *
            </label>
            <input
              id="pic"
              name="pic"
              type="text"
              required
              value={formData.pic}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter name of person in charge"
            />
          </div>

          <div>
            <label htmlFor="executionTime" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Execution Time *
            </label>
            <input
              id="executionTime"
              name="executionTime"
              type="datetime-local"
              required
              value={formData.executionTime}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-slate-300 mb-2">
              Status *
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
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="actionDescription" className="block text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Action Description *
            </label>
            <textarea
              id="actionDescription"
              name="actionDescription"
              required
              value={formData.actionDescription}
              onChange={handleChange}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe the forensic action taken..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={cases.length === 0}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isEditing ? 'Update Action' : 'Create Action'}
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
