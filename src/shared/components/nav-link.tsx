import { useActiveSection } from '@/shared/hooks/use-active-section';

interface NavLinksProps {
  mobile?: boolean;
  onClose?: () => void;
}

const links = [
  { href: "#hero", label: "Início" },
  { href: "#about", label: "Sobre" },
  { href: "#skills", label: "Habilidades" },
  // { href: "#projects", label: "Projetos" },
  { href: "#contact", label: "Contato" }
] as const;

const sectionIds = links.map((link) => link.href.slice(1));

const NavLinks: React.FC<NavLinksProps> = ({ mobile, onClose }) => {
  const activeSection = useActiveSection(sectionIds);

  const handleClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {links.map((link) => {
        const isActive = activeSection === link.href.slice(1);

        return (
          <a
            key={link.href}
            href={link.href}
            onClick={handleClick}
            aria-current={isActive ? 'true' : undefined}
            className={`transition-colors duration-300 relative group ${
              mobile
                ? `block py-3 hover:text-accent-300 ${isActive ? 'text-accent-300' : 'text-slate-200'}`
                : `text-sm hover:text-slate-100 ${isActive ? 'text-slate-100' : 'text-slate-400'}`
            }`}
          >
            {link.label}
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-accent-400 transition-all duration-300 group-hover:w-full ${
                isActive ? 'w-full' : 'w-0'
              }`}
            ></span>
          </a>
        );
      })}
    </>
  );
};
export default NavLinks;
