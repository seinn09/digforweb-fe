import { useState } from 'react';
import { Shield, Mail, Lock } from 'lucide-react';

type LoginProps = {
  onLogin: (email: string, password: string) => boolean;
  onSwitchToRegister: () => void;
};

export function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = onLogin(email, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 to-blue-950/20"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-cyan-600 rounded-lg flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-cyan-400 mb-2">DigForWeb</h1>
            <p className="text-slate-400">Digital Forensics Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
