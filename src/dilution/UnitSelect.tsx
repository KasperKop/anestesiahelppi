import { useState } from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { Button, ui } from '../ui/primitives';
import { Icon } from '../ui/Icon';
export default function UnitSelect({
  value,
  liquid,
  onChange,
}: {
  value: string;
  liquid: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          'Yksikkö: ' + (value ? value + (liquid ? '/ml' : '') : 'Valitse')
        }
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        style={[
          ui.input,
          {
            height: 52,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}
      >
        <Text>{value ? value + (liquid ? '/ml' : '') : 'Valitse'}</Text>
        <Icon name="down" size={18} />
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#0008',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View style={ui.panel} accessibilityViewIsModal>
            <Text style={ui.title}>Yksikkö</Text>
            {['µg', 'mg', 'g'].map((u) => (
              <Button
                key={u}
                label={u + (liquid ? '/ml' : '')}
                primary={value === u}
                onPress={() => {
                  onChange(u);
                  setOpen(false);
                }}
              />
            ))}
            <Button label="Peruuta" onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}
