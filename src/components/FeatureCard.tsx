import { Trophy, Shield, Lightning } from "lucide-react";
import { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: "trophy" | "shield" | "lightning";
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  const IconComponent: Record<string, ReactNode> = {
    trophy: <Trophy className="w-6 h-6 text-ixso-purple" />,
    shield: <Shield className="w-6 h-6 text-ixso-purple" />,
    lightning: <Lightning className="w-6 h-6 text-ixso-purple" />,
  };

  return (
    <div className="glass-card p-6 hover-glow animate-fade-up">
      <div className="mb-4">{IconComponent[icon]}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default FeatureCard;