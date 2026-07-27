interface AboutItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutItem: React.FC<AboutItemProps> = ({ icon, title, description }) => {
  return (
    <li className="flex items-start">
      <div className="mr-3 flex-shrink-0 sm:mr-4">
        {icon}
      </div>
      <div>
        <h4 className="mb-1 font-medium text-slate-200 sm:text-lg">{title}</h4>
        <p className="text-slate-400">{description}</p>
      </div>
    </li>
  );
};
export default AboutItem