import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { korbanService } from '../../services/korbanService';
import type { Victim } from '../../types/api';

interface VictimFormProps {
  victimId?: string;
  onBack: () => void;
}

export function VictimForm({ victimId, onBack }: VictimFormProps) {
  const isEditing = !!victimId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nama: '',
    kontak: '',
    lokasi: '',
    tgl_laporan: '',
    deskripsi_laporan: ''
  });

  useEffect(() => {
    if (isEditing && victimId) {
      fetchVictim();
    }
  }, [victimId, isEditing]);

  const fetchVictim = async () => {
    try {
      setLoading(true);
      const victim = await korbanService.getVictimById(Number(victimId));
      setFormData({
        nama: victim.nama,
        kontak: victim.kontak || '',
        lokasi: victim.lokasi || '',
        tgl_laporan: victim.tgl_laporan || '',
        deskripsi_laporan: victim.deskripsi_laporan || ''
      });
    } catch (err: any) {
      setError('Failed to load victim data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing && victimId) {
        await korbanService.updateVictim(Number(victimId), formData);
      } else {
        await korbanService.createVictim(formData);
      }
      onBack();
    } catch (err: any) {
      setError(err.message || 'Failed to save victim');
      console.error(err);
    } finally {
      setLoading(false);
    }
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

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nama" className="block text-slate-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Nama Lengkap *
            </label>
            <input
              id="nama"
              name="nama"
              type="text"
              required
              value={formData.nama}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama lengkap korban"
            />
          </div>

          <div>
            <label htmlFor="kontak" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Nomor Kontak *
            </label>
            <input
              id="kontak"
              name="kontak"
              type="tel"
              required
              value={formData.kontak}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="08123456789"
            />
          </div>

          <div>
            <label htmlFor="lokasi" className="block text-slate-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lokasi *
            </label>
            <input
              id="lokasi"
              name="lokasi"
              type="text"
              required
              value={formData.lokasi}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kota, Provinsi"
            />
          </div>

          <div>
            <label htmlFor="tgl_laporan" className="block text-slate-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Tanggal Laporan *
            </label>
            <input
              id="tgl_laporan"
              name="tgl_laporan"
              type="date"
              required
              value={formData.tgl_laporan}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="deskripsi_laporan" className="block text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Deskripsi Laporan *
            </label>
            <textarea
              id="deskripsi_laporan"
              name="deskripsi_laporan"
              required
              value={formData.deskripsi_laporan}
              onChange={handleChange}
              rows={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Jelaskan detail kejadian atau laporan..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Menyimpan...' : (isEditing ? 'Update Korban' : 'Buat Korban')}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
