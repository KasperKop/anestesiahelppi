import type { CSSProperties } from 'react';
type WeightRangeProps = { value: number; onChange: (value: number) => void };
export function WeightRange({ value, onChange }: WeightRangeProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: 48 }}>
      <input
        className="weight-range"
        type="range"
        min={3}
        max={30}
        step={1}
        value={value}
        aria-label="Paino"
        aria-valuetext={`${value} kg`}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--fill': `${((value - 3) / 27) * 100}%` } as CSSProperties}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 15,
          right: 15,
          bottom: 4,
          pointerEvents: 'none',
        }}
      >
        {[5, 10, 15, 20, 25, 30].map((v) => (
          <span
            key={v}
            style={{
              position: 'absolute',
              left: `${((v - 3) / 27) * 100}%`,
              height: 4,
              width: 1,
              background: '#6B7280',
            }}
          />
        ))}
      </div>
    </div>
  );
}
