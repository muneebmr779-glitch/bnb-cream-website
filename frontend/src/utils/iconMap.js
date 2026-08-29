import {
  Droplet,
  Disc,
  Cpu,
  Settings,
  Battery,
  Circle,
  Move,
  Wind,
  Layers,
  GitBranch,
  Zap,
  ClipboardCheck,
  Thermometer,
  Wrench,
} from 'lucide-react';

const iconMap = {
  droplet: Droplet,
  disc: Disc,
  cpu: Cpu,
  settings: Settings,
  battery: Battery,
  circle: Circle,
  move: Move,
  wind: Wind,
  layers: Layers,
  'git-branch': GitBranch,
  zap: Zap,
  'clipboard-check': ClipboardCheck,
  thermometer: Thermometer,
  tool: Wrench,
  wrench: Wrench,
};

export const getServiceIcon = (icon) => iconMap[icon] || Wrench;

export default iconMap;
