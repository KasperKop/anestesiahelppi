import { ui } from '../ui/primitives';
export default function UnitSelect({
  value,
  liquid,
  onChange,
}: {
  value: string;
  liquid: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <select
      aria-label="Yksikkö"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        minWidth: 0,
        height: 52,
        boxSizing: 'border-box',
        border: `1px solid ${ui.input.borderColor}`,
        borderRadius: ui.input.borderRadius,
        padding: '0 12px',
        fontFamily: 'inherit',
        fontSize: 16,
        color: ui.input.color,
        backgroundColor: 'white',
      }}
    >
      <option value="" disabled>
        Valitse
      </option>
      {['µg', 'mg', 'g'].map((u) => (
        <option key={u} value={u}>
          {u}
          {liquid ? '/ml' : ''}
        </option>
      ))}
    </select>
  );
}
