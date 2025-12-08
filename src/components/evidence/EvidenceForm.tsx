import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Save, Package, MapPin, Hash, Clock, AlertCircle } from 'lucide-react';

interface EvidenceFormProps {
  evidenceId?: string;
  onBack: () => void;
}

export function EvidenceForm({ evidenceId, onBack }: EvidenceFormProps) {
  const { evidence, cases, addEvidence, updateEvidence } = useApp();
  const isEditing = !!evidenceId;
  const evidenceItem = isEditing ? evidence.find(e => e.id === evidenceId) : null;

  const [formData, setFormData] = useState({
    caseId: '',
    evidenceType: '',
    storageLocation: '',
    hashValue: '',
    collectionTime: ''
  });

  useEffect(() => {
    if (evidenceItem) {
      setFormData({
        caseId: evidenceItem.caseId,
        evidenceType: evidenceItem.evidenceType,
        storageLocation: evidenceItem.storageLocation,
        hashValue: evidenceItem.hashValue,
        collectionTime: evidenceItem.collectionTime
      });
    } else {
      // Set default collection time to now
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setFormData(prev => ({ ...prev, collectionTime: localDateTime }));
    }
  }, [evidenceItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      collectionTime: new Date(formData.collectionTime).toISOString()
    };

    if (isEditing && evidenceId) {
      updateEvidence(evidenceId, submissionData);
    } else {
      addEvidence(submissionData);
    }

    onBack();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateHash = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 32; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    setFormData(prev => ({ ...prev, hashValue: hash }));
  };

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Evidence
      </button>

      <div className="mb-8">
        <h1 className="text-white text-3xl mb-2">
          {isEditing ? 'Edit Evidence' : 'Add New Evidence'}
        </h1>
        <p className="text-slate-400">
          {isEditing ? 'Update evidence information' : 'Register new digital evidence'}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-2xl">
        {cases.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2 text-yellow-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="mb-1">No cases found</p>
              <p className="text-sm text-yellow-400/80">You need to create a case first before adding evidence.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="caseId" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
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
            <label htmlFor="evidenceType" className="block text-slate-300 mb-2">
              Evidence Type *
            </label>
            <input
              id="evidenceType"
              name="evidenceType"
              type="text"
              required
              value={formData.evidenceType}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Email Logs, Hard Drive Image, Network Traffic"
            />
          </div>

          <div>
            <label htmlFor="storageLocation" className="block text-slate-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Storage Location *
            </label>
            <input
              id="storageLocation"
              name="storageLocation"
              type="text"
              required
              value={formData.storageLocation}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Server-A/Evidence/2025/Case-001"
            />
          </div>

          <div>
            <label htmlFor="hashValue" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Hash Value *
            </label>
            <div className="flex gap-2">
              <input
                id="hashValue"
                name="hashValue"
                type="text"
                required
                value={formData.hashValue}
                onChange={handleChange}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter or generate hash value"
              />
              <button
                type="button"
                onClick={generateHash}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Generate
              </button>
            </div>
            <p className="text-slate-500 text-sm mt-2">
              MD5/SHA-256 hash for evidence integrity verification
            </p>
          </div>

          <div>
            <label htmlFor="collectionTime" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Collection Time *
            </label>
            <input
              id="collectionTime"
              name="collectionTime"
              type="datetime-local"
              required
              value={formData.collectionTime}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={cases.length === 0}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isEditing ? 'Update Evidence' : 'Create Evidence'}
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
