import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorValidationMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <AlertCircle className="h-4 w-4 text-red-400" />
      <p className="text-xs text-red-400">{message}</p>
    </div>
  );
}
