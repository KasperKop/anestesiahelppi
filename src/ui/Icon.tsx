import {
  Trash2,
  Settings,
  Square,
  SquareCheck,
  Activity,
  TriangleAlert,
  Search,
  Pencil,
  Heart,
  House,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Send,
  LockKeyhole,
  type LucideIcon,
} from 'lucide-react-native';
import { View } from 'react-native';

const icons = {
  trash: Trash2,
  settings: Settings,
  square: Square,
  check: SquareCheck,
  activity: Activity,
  alert: TriangleAlert,
  search: Search,
  pencil: Pencil,
  heart: Heart,
  home: House,
  plus: Plus,
  minus: Minus,
  right: ArrowRight,
  left: ArrowLeft,
  down: ArrowDown,
  up: ArrowUp,
  send: Send,
  lock: LockKeyhole,
} satisfies Record<string, LucideIcon>;
export type IconName = keyof typeof icons;
export function Icon({
  name,
  color = '#136489',
  size = 24,
  filled = false,
}: {
  name: IconName;
  color?: string;
  size?: number;
  filled?: boolean;
}) {
  const Glyph = icons[name];
  return (
    <View
      aria-hidden
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Glyph
        size={size}
        color={color}
        strokeWidth={name === 'plus' || name === 'minus' ? 2.5 : 2}
        fill={filled ? color : 'none'}
      />
    </View>
  );
}
