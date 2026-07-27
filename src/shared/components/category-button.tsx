interface CategoryButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex min-h-[40px] items-center rounded-full border px-3.5 py-2 font-mono text-xs transition-colors duration-300 sm:px-4 sm:text-sm ${
        active
          ? 'border-accent-400/60 bg-accent-400/10 text-accent-300'
          : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
};

export default CategoryButton;
