interface AboutItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutItem: React.FC<AboutItemProps> = ({ icon, title, description }) => {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0 mr-4">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-medium mb-1 text-slate-200">{title}</h4>
        <p className="text-slate-400">{description}</p>
      </div>
    </li>
  );
};
export default AboutItem