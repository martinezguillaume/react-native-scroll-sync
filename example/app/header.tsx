import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SyncFlatList, SyncScrollView, SyncSectionList } from '../components';
import { colors } from '../colors';
import { useRef, useState } from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedSyncScrollView = Animated.createAnimatedComponent(SyncScrollView);
const AnimatedSyncFlatList = Animated.createAnimatedComponent(SyncFlatList);
const AnimatedSyncSectionList =
  Animated.createAnimatedComponent(SyncSectionList);

const WIDTH = Dimensions.get('window').width;
const BIG_HEADER_HEIGHT = 400;
const SMALL_HEADER_HEIGHT = 50;
const HEADER_INTERVAL = BIG_HEADER_HEIGHT - SMALL_HEADER_HEIGHT;

export default function Header() {
  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const scrollToIndex = (indexScroll: number) => {
    scrollRef.current?.scrollTo({
      x: indexScroll * WIDTH,
    });
  };

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <>
      <HeaderComponent
        scrollY={scrollY}
        onPrevious={() => scrollToIndex(index - 1)}
        onNext={() => scrollToIndex(index + 1)}
      />

      <ScrollView
        ref={scrollRef}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top || 16 }}
        onScroll={(e) => {
          const offset = e.nativeEvent.contentOffset.x;
          const newIndex = Math.floor(offset / WIDTH);
          if (newIndex !== index) {
            setIndex(newIndex);
          }
        }}
      >
        <View style={styles.tab}>
          <AnimatedSyncScrollView
            color={colors.blue}
            syncInterval={[0, HEADER_INTERVAL]}
            contentContainerStyle={{ paddingTop: BIG_HEADER_HEIGHT }}
            onScroll={scrollHandler}
          />
        </View>
        <View style={styles.tab}>
          <AnimatedSyncFlatList
            color={colors.red}
            syncInterval={[0, HEADER_INTERVAL]}
            contentContainerStyle={{ paddingTop: BIG_HEADER_HEIGHT }}
            onScroll={scrollHandler}
          />
        </View>
        <View style={styles.tab}>
          <AnimatedSyncSectionList
            color={colors.blue}
            syncInterval={[0, HEADER_INTERVAL]}
            contentContainerStyle={{ paddingTop: BIG_HEADER_HEIGHT }}
            onScroll={scrollHandler}
          />
        </View>
      </ScrollView>
    </>
  );
}

const HeaderComponent = ({
  scrollY,
  onNext,
  onPrevious,
}: {
  scrollY: SharedValue<number>;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const viewRef = useRef<View>(null);

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, HEADER_INTERVAL],
        [BIG_HEADER_HEIGHT, SMALL_HEADER_HEIGHT],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.View
      ref={viewRef}
      style={[styles.headerContainer, { paddingTop: insets.top || 16 }]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[styles.header, headerStyle]}
        pointerEvents="box-none"
      >
        <TouchableOpacity onPress={onPrevious}>
          <Text style={styles.headerArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} pointerEvents="none">
          HEADER
        </Text>
        <TouchableOpacity onPress={onNext}>
          <Text style={styles.headerArrow}>{'>'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.pink,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerArrow: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 40,
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tab: {
    flex: 1,
    width: WIDTH,
  },
});
