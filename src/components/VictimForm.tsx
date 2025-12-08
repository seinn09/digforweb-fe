import { useState } from 'react';
import { Victim } from '../App';
import { ArrowLeft, Save } from 'lucide-react';

type VictimFormProps = {
  victimId?: string;
  victims: Victim[];
  onSave: (victim: Victim) => void;
  onCancel: () => void;
};

export function VictimForm({ victimId, victims, onSave, onCancel }: VictimFormProps) {
  const existingVictim = victimId ? victims.find(v => v.id === victimId) : null;
  const isEdit = !!existingVictim;

  const [formData, setFormData] = useState({
    name: existingVictim?.name || '',
    contact: existingVictim?.contact || '',
    location: existingVictim?.location || '',
    reportDate: existingVictim?.reportDate || new Date().toISOString().split('T')[0],
    reportDescription: existingVictim?.reportDescription || ''
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

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.reportDate) newErrors.reportDate = 'Report date is required';
    if (!formData.reportDescription.trim()) newErrors.reportDescription = 'Report description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const victim: Victim = {
      id: existingVictim?.id || Date.now().toString(),
      ...formData,
      createdAt: existingVictim?.createdAt || new Date().toISOString()
    };

    onSave(victim);
  };

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
          <h2 className="text-cyan-400 mb-1">{isEdit ? 'Edit Victim' : 'Add New Victim'}</h2>
          <p className="text-slate-400">{isEdit ? 'Update victim information' : 'Create a new victim record'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full bg-slate-800 border ${errors.name ? 'border-red-600' : 'border-slate-700'} rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600`}
                placeholder="Enter victim name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Contact <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                className={`w-full bg-slate-800 border ${errors.contact ? 'border-red-600' : 'border-slate-700'} rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600`}
                placeholder="Phone number or email"
              />
              {errors.contact && <p className="text-red-400 text-sm mt-1">{errors.contact}</p>}
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full bg-slate-800 border ${errors.location ? 'border-red-600' : 'border-slate-700'} rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600`}
                placeholder="City, State"
              />
              {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">
                Report Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.reportDate}
                onChange={(e) => handleChange('reportDate', e.target.value)}
                className={`w-full bg-slate-800 border ${errors.reportDate ? 'border-red-600' : 'border-slate-700'} rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600`}
              />
              {errors.reportDate && <p className="text-red-400 text-sm mt-1">{errors.reportDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">
              Report Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.reportDescription}
              onChange={(e) => handleChange('reportDescription', e.target.value)}
              rows={5}
              className={`w-full bg-slate-800 border ${errors.reportDescription ? 'border-red-600' : 'border-slate-700'} rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 resize-none`}
              placeholder="Detailed description of the report..."
            />
            {errors.reportDescription && <p className="text-red-400 text-sm mt-1">{errors.reportDescription}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {isEdit ? 'Update Victim' : 'Create Victim'}
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
