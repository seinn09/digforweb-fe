import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Save, User, Phone, MapPin, Calendar, FileText } from 'lucide-react';

interface VictimFormProps {
  victimId?: string;
  onBack: () => void;
}

export function VictimForm({ victimId, onBack }: VictimFormProps) {
  const { victims, addVictim, updateVictim } = useApp();
  const isEditing = !!victimId;
  const victim = isEditing ? victims.find(v => v.id === victimId) : null;

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    reportDate: '',
    reportDescription: ''
  });

  useEffect(() => {
    if (victim) {
      setFormData({
        name: victim.name,
        contact: victim.contact,
        location: victim.location,
        reportDate: victim.reportDate,
        reportDescription: victim.reportDescription
      });
    }
  }, [victim]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && victimId) {
      updateVictim(victimId, formData);
    } else {
      addVictim(formData);
    }

    onBack();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        Back to Victims
      </button>

      <div className="mb-8">
        <h1 className="text-white text-3xl mb-2">
          {isEditing ? 'Edit Victim' : 'Add New Victim'}
        </h1>
        <p className="text-slate-400">
          {isEditing ? 'Update victim information' : 'Create a new victim record'}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-slate-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter victim's full name"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Number *
            </label>
            <input
              id="contact"
              name="contact"
              type="tel"
              required
              value={formData.contact}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1-555-0000"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-slate-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City, State/Country"
            />
          </div>

          <div>
            <label htmlFor="reportDate" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Report Date *
            </label>
            <input
              id="reportDate"
              name="reportDate"
              type="date"
              required
              value={formData.reportDate}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="reportDescription" className="block text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Report Description *
            </label>
            <textarea
              id="reportDescription"
              name="reportDescription"
              required
              value={formData.reportDescription}
              onChange={handleChange}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe the incident or report details..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              {isEditing ? 'Update Victim' : 'Create Victim'}
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
