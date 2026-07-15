interface SocialButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-800 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-accent-400/50 hover:text-accent-300"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

export default SocialButton;
