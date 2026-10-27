import Slider from '@react-native-community/slider';
export type WeightRangeProps = {
  value: number;
  onChange: (value: number) => void;
};
export function WeightRange({ value, onChange }: WeightRangeProps) {
  return (
    <Slider
      accessibilityLabel="Paino"
      accessibilityValue={{ min: 3, max: 30, now: value, text: `${value} kg` }}
      minimumValue={3}
      maximumValue={30}
      step={1}
      value={value}
      onValueChange={onChange}
      minimumTrackTintColor="#136489"
      maximumTrackTintColor="#D7D3C9"
      thumbTintColor="#136489"
      style={{ width: '100%', height: 48 }}
    />
  );
}
