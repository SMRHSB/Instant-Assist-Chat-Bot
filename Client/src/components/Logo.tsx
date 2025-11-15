import { Bot, CircuitBoard, Cpu } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: {
      container: 'w-8 h-8',
      mainIcon: 'w-5 h-5',
      subIcon: 'w-3 h-3',
    },
    md: {
      container: 'w-10 h-10',
      mainIcon: 'w-6 h-6',
      subIcon: 'w-4 h-4',
    },
    lg: {
      container: 'w-12 h-12',
      mainIcon: 'w-7 h-7',
      subIcon: 'w-5 h-5',
    },
  };

  return (
    <div className={`relative ${sizes[size].container} bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg`}>
      <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Bot className={`${sizes[size].mainIcon} text-white`} strokeWidth={2.5} />
      </div>
      <div className="absolute -bottom-1 -right-1">
        <div className="relative">
          <CircuitBoard className={`${sizes[size].subIcon} text-blue-300`} />
          <Cpu className={`${sizes[size].subIcon} text-blue-200 absolute top-0 left-0 transform rotate-45 opacity-50`} />
        </div>
      </div>
    </div>
  );
}