import { Tag } from "lucide-react";

interface TagButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const TagButton: React.FC<TagButtonProps> = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 font-mono text-sm transition-colors duration-300 flex items-center ${
        active
          ? 'border-accent-400/60 bg-accent-400/10 text-accent-300'
          : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
      }`}
    >
      {active && <Tag size={14} className="mr-2" />}
      {children}
    </button>
  );
};

export default TagButton;
