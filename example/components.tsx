import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  FlatList,
  ScrollView,
  SectionList,
  type FlatListProps,
  type ScrollViewProps,
} from 'react-native-scroll-sync';
import { colors } from './colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const data = Array.from({ length: 100 }).map((_, i) => i);

export const SyncFlatList = ({
  color,
  contentContainerStyle,
  ...props
}: Partial<FlatListProps<number>> & {
  color: string;
}) => {
  const insets = useSafeAreaInsets();
  const ref = useRef<FlatList<number>>(null);
  const { horizontal } = props;

  return (
    <View style={!horizontal ? styles.flex : undefined}>
      <FlatList
        ref={ref}
        keyExtractor={(i) => i.toString()}
        {...props}
        data={data}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          {
            paddingBottom: !horizontal ? insets.bottom || 16 : undefined,
            paddingTop: !horizontal ? insets.top || 16 : undefined,
          },
          contentContainerStyle,
        ]}
        renderItem={({ item, index }) => (
          <Item title={item.toString()} index={index} color={color} />
        )}
      />
      <ScrollButton
        onPress={(offset) => ref.current?.scrollToOffset({ offset })}
        horizontal={horizontal}
      />
    </View>
  );
};

export const SyncScrollView = ({
  color,
  title,
  contentContainerStyle,
  isSyncIntervalVisible,
  ...props
}: Partial<ScrollViewProps> & {
  color: string;
  title?: string;
  isSyncIntervalVisible?: boolean;
}) => {
  const insets = useSafeAreaInsets();
  const ref = useRef<ScrollView>(null);
  const { syncInterval, horizontal } = props;

  return (
    <View style={!horizontal ? styles.flex : undefined}>
      <ScrollView
        ref={ref}
        {...props}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          {
            paddingBottom: !horizontal ? insets.bottom || 16 : undefined,
            paddingTop: !horizontal ? insets.top || 16 : undefined,
          },
          contentContainerStyle,
        ]}
      >
        {syncInterval && isSyncIntervalVisible && (
          <View
            style={[
              styles.syncInterval,
              !horizontal
                ? {
                    top: syncInterval[0],
                    height: syncInterval[1] - syncInterval[0],
                  }
                : {
                    left: syncInterval[0],
                    width: syncInterval[1] - syncInterval[0],
                  },
            ]}
          />
        )}
        {data.map((item, index) => (
          <Item
            key={item}
            title={index === 0 && title ? title : item.toString()}
            index={index}
            color={color}
          />
        ))}
      </ScrollView>
      <ScrollButton
        onPress={(offset) => ref.current?.scrollTo({ y: offset })}
        horizontal={horizontal}
      />
    </View>
  );
};

export const SyncSectionList = ({
  color,
  contentContainerStyle,
  ...props
}: Partial<ScrollViewProps> & {
  color: string;
}) => {
  const insets = useSafeAreaInsets();
  const ref = useRef<SectionList>(null);
  const { horizontal } = props;

  return (
    <View style={styles.flex}>
      <SectionList
        sections={[{ data: data, key: '1' }]}
        ref={ref}
        {...props}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Item title={item.toString()} index={index} color={color} />
        )}
        contentContainerStyle={[
          {
            paddingBottom: !horizontal ? insets.bottom || 16 : undefined,
            paddingTop: !horizontal ? insets.top || 16 : undefined,
          },
          contentContainerStyle,
        ]}
      />
      <ScrollButton
        onPress={(offset) => {
          ref.current?.scrollToLocation({
            viewOffset: -offset,
            itemIndex: 0,
            sectionIndex: 0,
          });
        }}
        horizontal={props.horizontal}
      />
    </View>
  );
};

const Item = ({
  title,
  index,
  color,
}: {
  title: string;
  index: number;
  color: string;
}) => {
  return (
    <View
      style={[
        styles.item,
        { backgroundColor: color + (index % 2 === 0 ? '' : '80') },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const ScrollButton = ({
  onPress,
  horizontal,
}: {
  onPress: (offset: number) => void;
  horizontal?: boolean | null;
}) => {
  const insets = useSafeAreaInsets();
  const [scrollOffset, setScrollOffset] = useState(0);

  return (
    <Pressable
      style={[
        styles.scrollButton,
        horizontal
          ? styles.scrollButtonHorizontal
          : {
              bottom: (insets.bottom || 16) + 16,
            },
      ]}
      onPress={() => {
        const offset = Math.round(Math.random() * 50 * 100);
        setScrollOffset(offset);
        onPress(offset);
      }}
    >
      <Text style={styles.scrollButtonText}>
        Scroll{scrollOffset ? ` - ${scrollOffset}` : null}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  divider: {
    height: 12,
  },
  syncInterval: {
    position: 'absolute',
    backgroundColor: 'red',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  item: {
    height: 50,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 4,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollButton: {
    position: 'absolute',
    left: 8,
    right: 8,
    borderRadius: 8,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  scrollButtonHorizontal: {
    top: 8,
    bottom: 8,
    right: 16,
    left: 'auto',
    paddingHorizontal: 8,
  },
  scrollButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
