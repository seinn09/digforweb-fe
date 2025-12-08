import { useState } from 'react';
import { Case, Victim } from '../App';
import { ArrowLeft, Save } from 'lucide-react';

type CaseFormProps = {
  caseId?: string;
  cases: Case[];
  victims: Victim[];
  onSave: (caseItem: Case) => void;
  onCancel: () => void;
};

export function CaseForm({ caseId, cases, victims, onSave, onCancel }: CaseFormProps) {
  const existingCase = caseId ? cases.find(c => c.id === caseId) : null;
  const isEdit = !!existingCase;

  const [formData, setFormData] = useState({
    victimId: existingCase?.victimId || '',
    caseType: existingCase?.caseType || '',
    incidentDate: existingCase?.incidentDate || new Date().toISOString().split('T')[0],
    caseSummary: existingCase?.caseSummary || '',
    caseStatus: existingCase?.caseStatus || 'Pending'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.victimId) newErrors.victimId = 'Please select a victim';
    if (!formData.caseType.trim()) newErrors.caseType = 'Case type is required';
    if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required';
    if (!formData.caseSummary.trim()) newErrors.caseSummary = 'Case summary is required';
    if (!formData.caseStatus.trim()) newErrors.caseStatus = 'Case status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const caseItem: Case = {
      id: existingCase?.id || Date.now().toString(),
      ...formData,
      createdAt: existingCase?.createdAt || new Date().toISOString()
    };

    onSave(caseItem);
  };

  const statusOptions = ['Pending', 'Active', 'Under Investigation', 'Closed'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-cyan-400 mb-1">{isEdit ? 'Edit Case' : 'Add New Case'}</h2>
          <p className="text-slate-400">{isEdit ? 'Update case information' : 'Create a new case record'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Select Victim <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.victimId}
                onChange={(e) => handleChange('victimId', e.target.value)}
                className={`w-full bg-slate-800 border ${errors.victimId ? 'border-red-600' : 'border-slate-700'} rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600`}
              >
                <option value="">Select a victim...</option>
                {victims.map(victim => (
                  <option key={victim.id} value={victim.id}>
                    {victim.name}
                  </option>
                ))}
              </select>
              {errors.victimId && <p className="text-red-400 text-sm mt-1">{errors.victimId}</p>}
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Case Type <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.caseType}
                onChange={(e) => handleChange('caseType', e.target.value)}
                className={`w-full bg-slate-800 border ${errors.caseType ? 'border-red-600' : 'border-slate-700'} rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600`}
                placeholder="e.g., Identity Theft, Data Breach"
              />
              {errors.caseType && <p className="text-red-400 text-sm mt-1">{errors.caseType}</p>}
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Incident Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => handleChange('incidentDate', e.target.value)}
                className={`w-full bg-slate-800 border ${errors.incidentDate ? 'border-red-600' : 'border-slate-700'} rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600`}
              />
              {errors.incidentDate && <p className="text-red-400 text-sm mt-1">{errors.incidentDate}</p>}
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Case Status <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.caseStatus}
                onChange={(e) => handleChange('caseStatus', e.target.value)}
                className={`w-full bg-slate-800 border ${errors.caseStatus ? 'border-red-600' : 'border-slate-700'} rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600`}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.caseStatus && <p className="text-red-400 text-sm mt-1">{errors.caseStatus}</p>}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">
              Case Summary <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.caseSummary}
              onChange={(e) => handleChange('caseSummary', e.target.value)}
              rows={5}
              className={`w-full bg-slate-800 border ${errors.caseSummary ? 'border-red-600' : 'border-slate-700'} rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 resize-none`}
              placeholder="Detailed summary of the case..."
            />
            {errors.caseSummary && <p className="text-red-400 text-sm mt-1">{errors.caseSummary}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {isEdit ? 'Update Case' : 'Create Case'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
