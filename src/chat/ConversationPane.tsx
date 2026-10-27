import { ReactNode, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '../ui/primitives';

/** Only the log scrolls; the composer is a sibling, never part of the log. */
export function ConversationPane({
  children,
  composer,
  revision,
  request,
  label,
  empty = false,
  maxLogHeight = 300,
}: {
  children: ReactNode;
  composer: ReactNode;
  revision: number;
  request: number;
  label: string;
  empty?: boolean;
  maxLogHeight?: number;
}) {
  const log = useRef<ScrollView>(null);
  const following = useRef(true);
  const [position, setPosition] = useState({
    atBottom: true,
    seen: revision,
    request,
  });
  const unread =
    !position.atBottom &&
    position.request === request &&
    position.seen !== revision;
  useEffect(() => {
    following.current = true;
    log.current?.scrollToEnd({ animated: false });
  }, [request]);
  return (
    <View style={{ minHeight: 0 }}>
      {!empty && (
        <ScrollView
          ref={log}
          testID={`${label}-log`}
          accessibilityLabel={
            label === 'chat' ? 'Keskustelun viestit' : 'Omat muistiinpanot'
          }
          style={{ maxHeight: maxLogHeight, flexShrink: 1 }}
          contentContainerStyle={conversationStyles.log}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={32}
          onScroll={({ nativeEvent: e }) => {
            following.current =
              e.contentSize.height -
                e.contentOffset.y -
                e.layoutMeasurement.height <
              60;
            const atBottom = following.current;
            setPosition((previous) => ({
              atBottom,
              seen: atBottom ? revision : previous.seen,
              request,
            }));
          }}
          onContentSizeChange={() => {
            if (following.current)
              log.current?.scrollToEnd({ animated: false });
          }}
        >
          {children}
        </ScrollView>
      )}
      {unread && (
        <View style={conversationStyles.jump}>
          <Button
            label={label === 'chat' ? 'Uusi vastaus' : 'Uusi muistiinpano'}
            icon="down"
            onPress={() => {
              following.current = true;
              setPosition({ atBottom: true, seen: revision, request });
              log.current?.scrollToEnd({ animated: false });
            }}
          />
        </View>
      )}
      <View testID={`${label}-composer`} style={conversationStyles.composer}>
        {composer}
      </View>
    </View>
  );
}
export const conversationStyles = StyleSheet.create({
  fill: { minHeight: 0 },
  log: { padding: 16, gap: 16 },
  composer: {
    flexShrink: 0,
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderColor: '#C8E8F7',
    backgroundColor: '#FFFFFF',
  },
  input: { minHeight: 48, maxHeight: 104, textAlignVertical: 'top' },
  jump: { paddingHorizontal: 12, paddingVertical: 4 },
});
