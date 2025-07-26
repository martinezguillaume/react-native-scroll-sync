import {
  createRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type Ref,
  type RefObject,
} from 'react';
import {
  type SectionListProps as RNSectionListProps,
  SectionList as RNSectionList,
  type ScrollViewProps as RNScrollViewProps,
  ScrollView as RNScrollView,
  FlatList as RNFlatList,
  type FlatListProps as RNFlatListProps,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type DefaultSectionT,
} from 'react-native';

const keyStates: Record<
  string,
  {
    states: Array<RefObject<ScrollSyncState>>;
    activeState: RefObject<ScrollSyncState>;
  }
> = {};

type ScrollSyncRef = {
  scrollTo: (offset: number) => void;
};
type ScrollSyncState = {
  lastOffset: number;
  scrollRef: RefObject<ScrollSyncRef | null>;
};
type ScrollSyncProps = Pick<RNScrollViewProps, 'horizontal' | 'onScroll'> & {
  syncKey?: string;
  syncInterval?: [number, number];
  syncType?: 'absolute' | 'relative';
};
const useScrollSync = ({
  syncKey = 'DEFAULT',
  syncInterval = [-Infinity, Infinity],
  syncType = 'absolute',
  horizontal = false,
  ...props
}: ScrollSyncProps) => {
  const stateRef = useRef<ScrollSyncState>({
    lastOffset: 0,
    scrollRef: createRef<ScrollSyncRef>(),
  });

  useEffect(() => {
    if (!keyStates[syncKey]) {
      keyStates[syncKey] = {
        activeState: stateRef,
        states: [],
      };
    }
    keyStates[syncKey].states.push(stateRef);
    // syncRef.current?.scrollTo(globalState[syncKey].lastScrollY);

    return () => {
      if (keyStates[syncKey]) {
        keyStates[syncKey].states = keyStates[syncKey].states.filter(
          (state) => state !== stateRef
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncKey, syncInterval?.toString()]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const keyState = keyStates[syncKey];
    const contentOffset = horizontal
      ? e.nativeEvent.contentOffset.x
      : e.nativeEvent.contentOffset.y;
    if (stateRef === keyState?.activeState) {
      props.onScroll?.(e);

      let offset: number | null = contentOffset;
      if (
        offset <= syncInterval[0] &&
        !(stateRef.current.lastOffset <= syncInterval[0])
      ) {
        offset = syncInterval[0];
      } else if (
        offset >= syncInterval[1] &&
        !(stateRef.current.lastOffset >= syncInterval[1])
      ) {
        offset = syncInterval[1];
      } else if (offset <= syncInterval[0] || offset >= syncInterval[1]) {
        offset = null;
      }

      keyState.states.forEach((state) => {
        if (state !== stateRef) {
          if (offset !== null) {
            if (syncType === 'absolute') {
              state.current?.scrollRef.current?.scrollTo(offset);
            } else {
              const diffOffset = offset - stateRef.current.lastOffset;
              state.current?.scrollRef.current?.scrollTo(
                state.current.lastOffset + diffOffset
              );
            }
          }
        }
      });
    }
    stateRef.current.lastOffset = contentOffset;
  };

  const setActive = () => {
    const keyState = keyStates[syncKey];
    if (keyState) {
      keyState.activeState = stateRef;
    }
  };

  return {
    scrollRef: stateRef.current.scrollRef,
    onScroll,
    setActive,
  };
};

export type FlatList<ItemT = any> = RNFlatList<ItemT>;
export type FlatListProps<ItemT> = RNFlatListProps<ItemT> & ScrollSyncProps;
export const FlatList = <ItemT,>({
  syncKey,
  syncInterval,
  syncType,
  horizontal,
  ...props
}: FlatListProps<ItemT> & { ref?: Ref<RNFlatList> }) => {
  const { onScroll, scrollRef, setActive } = useScrollSync({
    syncKey,
    syncInterval,
    syncType,
    horizontal,
    onScroll: props.onScroll,
  });

  const ref = useRef<RNFlatList>(null);
  useImperativeHandle(
    props.ref,
    () =>
      ({
        ...ref.current,
        scrollToOffset(...args) {
          setActive();
          ref.current?.scrollToOffset(...args);
        },
        scrollToEnd(...args) {
          setActive();
          ref.current?.scrollToEnd(...args);
        },
        scrollToIndex(...args) {
          setActive();
          ref.current?.scrollToIndex(...args);
        },
        scrollToItem(...args) {
          setActive();
          ref.current?.scrollToItem(...args);
        },
      }) as RNFlatList
  );

  useImperativeHandle(scrollRef, () => ({
    scrollTo(offset) {
      ref.current?.scrollToOffset({ offset, animated: false });
    },
  }));

  return (
    <RNFlatList
      scrollEventThrottle={16}
      horizontal={horizontal}
      {...props}
      ref={ref}
      onScroll={onScroll}
      onScrollBeginDrag={(e) => {
        setActive();
        props.onScrollBeginDrag?.(e);
      }}
    />
  );
};

export type ScrollView = RNScrollView;
export type ScrollViewProps = RNScrollViewProps & ScrollSyncProps;
export const ScrollView = ({
  syncInterval,
  syncKey,
  syncType,
  horizontal,
  ...props
}: ScrollViewProps & {
  ref?: Ref<RNScrollView>;
}) => {
  const { onScroll, scrollRef, setActive } = useScrollSync({
    syncKey,
    syncInterval,
    syncType,
    horizontal,
    onScroll: props.onScroll,
  });

  const ref = useRef<RNScrollView>(null);
  useImperativeHandle(
    props.ref,
    () =>
      ({
        ...ref.current,
        scrollTo(...args) {
          setActive();
          ref.current?.scrollTo(...args);
        },
        scrollToEnd(...args) {
          setActive();
          ref.current?.scrollToEnd(...args);
        },
      }) as RNScrollView
  );

  useImperativeHandle(scrollRef, () => ({
    scrollTo(offset) {
      ref.current?.scrollTo({
        y: horizontal ? undefined : offset,
        x: horizontal ? offset : undefined,
        animated: false,
      });
    },
  }));

  return (
    <RNScrollView
      scrollEventThrottle={16}
      horizontal={horizontal}
      {...props}
      ref={ref}
      onScroll={onScroll}
      onScrollBeginDrag={(e) => {
        setActive();
        props.onScrollBeginDrag?.(e);
      }}
    />
  );
};

export type SectionList<
  ItemT = any,
  SectionT = DefaultSectionT,
> = RNSectionList<ItemT, SectionT>;
export type SectionListProps<
  ItemT,
  SectionT = DefaultSectionT,
> = RNSectionListProps<ItemT, SectionT> & ScrollSyncProps;
export const SectionList = <ItemT, SectionT>({
  syncKey,
  syncInterval,
  syncType,
  horizontal,
  ...props
}: SectionListProps<ItemT, SectionT> & {
  ref?: Ref<RNSectionList<ItemT, SectionT>>;
}) => {
  const { onScroll, scrollRef, setActive } = useScrollSync({
    syncKey,
    syncInterval,
    syncType,
    horizontal,
  });

  const ref = useRef<RNSectionList<ItemT, SectionT>>(null);
  useImperativeHandle(
    props.ref,
    () =>
      ({
        ...ref.current,
        scrollToLocation(...args) {
          setActive();
          ref.current?.scrollToLocation(...args);
        },
      }) as RNSectionList<ItemT, SectionT>
  );

  useImperativeHandle(scrollRef, () => ({
    scrollTo(offset) {
      ref.current?.scrollToLocation({
        viewOffset: -offset,
        itemIndex: 0,
        sectionIndex: 0,
        animated: false,
      });
    },
  }));

  return (
    <RNSectionList
      scrollEventThrottle={16}
      horizontal={horizontal}
      {...props}
      ref={ref}
      onScroll={onScroll}
      onScrollBeginDrag={(e) => {
        setActive();
        props.onScrollBeginDrag?.(e);
      }}
    />
  );
};
