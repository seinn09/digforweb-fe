import { EyeOff } from 'lucide-react';

interface ReadOnlyBannerProps {
  message?: string;
}

export function ReadOnlyBanner({ message = "You are viewing in read-only mode" }: ReadOnlyBannerProps) {
  return (
    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
      <EyeOff className="w-5 h-5 text-blue-400" />
      <p className="text-blue-300 text-sm">
        <strong>Viewer Mode:</strong> {message}
      </p>
    </div>
  );
}
