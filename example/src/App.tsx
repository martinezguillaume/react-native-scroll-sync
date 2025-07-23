import { useRef, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import {
  FlatList,
  ScrollView,
  SectionList,
  type FlatListProps,
  type ScrollViewProps,
} from 'react-native-scroll-sync';

const data = Array.from({ length: 100 }).map((_, i) => i);

export default function App() {
  return (
    <View style={styles.container}>
      <SyncFlatList
        syncKey="FIRST"
        itemColor="#4052D6"
        syncInterval={[0, 1000]}
      />
      <SyncFlatList
        syncKey="SECOND"
        itemColor="#FA5053"
        syncInterval={[0, 1000]}
      />
      <SyncFlatList
        syncKey="FIRST"
        itemColor="#4052D6"
        syncInterval={[0, 1000]}
      />
      <SyncFlatList
        syncKey="SECOND"
        itemColor="#FA5053"
        syncInterval={[0, 1000]}
      />
      <SyncScrollView
        syncKey="FIRST"
        itemColor="#4052D6"
        syncInterval={[0, 1000]}
      />
      <SyncSectionList
        syncKey="FIRST"
        itemColor="#4052D6"
        syncInterval={[0, 1000]}
      />
    </View>
  );
}

const SyncFlatList = ({
  syncKey,
  itemColor,
  syncInterval,
}: Partial<FlatListProps<number>> & {
  syncKey: string;
  syncInterval?: [number, number];
  itemColor: string;
}) => {
  const ref = useRef<FlatList<number>>(null);
  const [scrollItem, setScrollItem] = useState(0);

  return (
    <View style={styles.scrollContainer}>
      <FlatList
        ref={ref}
        keyExtractor={(i) => i.toString()}
        syncKey={syncKey}
        syncInterval={syncInterval}
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.item,
              { backgroundColor: itemColor + (index % 2 === 0 ? '' : '80') },
            ]}
          >
            <Text style={styles.text}>{item}</Text>
          </View>
        )}
      />
      <Pressable
        style={styles.scrollButton}
        onPress={() => {
          const item = Math.round(Math.random() * 100);
          setScrollItem(item);
          ref.current?.scrollToItem({
            item,
          });
        }}
      >
        <Text style={styles.scrollButtonText}>
          Scroll{scrollItem ? ` - ${scrollItem}` : null}
        </Text>
      </Pressable>
    </View>
  );
};

const SyncScrollView = ({
  syncKey,
  itemColor,
  syncInterval,
}: Partial<ScrollViewProps> & {
  syncKey: string;
  syncInterval?: [number, number];
  itemColor: string;
}) => {
  const ref = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  return (
    <View style={styles.scrollContainer}>
      <ScrollView
        ref={ref}
        syncKey={syncKey}
        syncInterval={syncInterval}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item, index) => (
          <View
            key={item}
            style={[
              styles.item,
              { backgroundColor: itemColor + (index % 2 === 0 ? '' : '80') },
            ]}
          >
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </ScrollView>
      <Pressable
        style={styles.scrollButton}
        onPress={() => {
          const offset = Math.round(Math.random() * 50 * 100);
          setScrollOffset(offset);
          ref.current?.scrollTo({ y: offset });
        }}
      >
        <Text style={styles.scrollButtonText}>
          Scroll{scrollOffset ? ` - ${scrollOffset}` : null}
        </Text>
      </Pressable>
    </View>
  );
};

const SyncSectionList = ({
  syncKey,
  itemColor,
  syncInterval,
}: Partial<ScrollViewProps> & {
  syncKey: string;
  syncInterval?: [number, number];
  itemColor: string;
}) => {
  const ref = useRef<SectionList>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  return (
    <View style={styles.scrollContainer}>
      <SectionList
        sections={[{ data: data, key: '1' }]}
        ref={ref}
        syncKey={syncKey}
        syncInterval={syncInterval}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.item,
              { backgroundColor: itemColor + (index % 2 === 0 ? '' : '80') },
            ]}
          >
            <Text style={styles.text}>{item}</Text>
          </View>
        )}
      >
        {data.map((item, index) => (
          <View
            key={item}
            style={[
              styles.item,
              { backgroundColor: itemColor + (index % 2 === 0 ? '' : '80') },
            ]}
          >
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </SectionList>
      <Pressable
        style={styles.scrollButton}
        onPress={() => {
          const offset = Math.round(Math.random() * 50 * 100);
          setScrollOffset(offset);
          ref.current?.scrollToLocation({
            viewOffset: -offset,
            itemIndex: 0,
            sectionIndex: 0,
          });
        }}
      >
        <Text style={styles.scrollButtonText}>
          Scroll{scrollOffset ? ` - ${scrollOffset}` : null}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  scrollContainer: {
    flex: 1,
  },
  item: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4052D6',
    margin: 4,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollButton: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 0,
    borderRadius: 8,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#44D7A8',
  },
  scrollButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
