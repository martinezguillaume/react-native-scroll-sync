import {
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

const globalState: Record<
  string,
  {
    refs: Array<RefObject<ScrollSyncRef | null>>;
    activeRef: RefObject<ScrollSyncRef | null>;
  }
> = {};

type ScrollSyncRef = {
  scrollTo: (offset: number) => void;
};
type ScrollSyncProps = {
  syncKey?: string;
  syncInterval?: [number, number];
};
const useScrollSync = ({
  syncKey = 'DEFAULT',
  syncInterval = [-Infinity, Infinity],
}: ScrollSyncProps) => {
  const syncRef = useRef<ScrollSyncRef>(null);
  const lastOffset = useRef(0);

  useEffect(() => {
    if (!globalState[syncKey]) {
      globalState[syncKey] = {
        activeRef: syncRef,
        refs: [],
      };
    }
    globalState[syncKey].refs.push(syncRef);
    // syncRef.current?.scrollTo(globalState[syncKey].lastScrollY);

    return () => {
      if (globalState[syncKey]) {
        globalState[syncKey].refs = globalState[syncKey].refs.filter(
          (ref) => ref !== syncRef
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncKey, syncInterval?.toString()]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const state = globalState[syncKey];
    if (syncRef === state?.activeRef) {
      let offset: number | null = e.nativeEvent.contentOffset.y;
      if (
        offset <= syncInterval[0] &&
        !(lastOffset.current <= syncInterval[0])
      ) {
        offset = syncInterval[0];
      } else if (
        offset >= syncInterval[1] &&
        !(lastOffset.current >= syncInterval[1])
      ) {
        offset = syncInterval[1];
      } else if (offset <= syncInterval[0] || offset >= syncInterval[1]) {
        offset = null;
      }

      state.refs?.forEach((ref) => {
        if (syncRef !== ref) {
          if (offset !== null) {
            ref.current?.scrollTo(offset);
          }
        }
      });
    }
    lastOffset.current = e.nativeEvent.contentOffset.y;
  };

  const setActive = () => {
    if (globalState[syncKey]) {
      globalState[syncKey].activeRef = syncRef;
    }
  };

  return {
    syncRef,
    onScroll,
    setActive,
  };
};

export type FlatList<ItemT = any> = RNFlatList<ItemT>;
export type FlatListProps<ItemT> = RNFlatListProps<ItemT> & ScrollSyncProps;
export const FlatList = <ItemT,>({
  syncKey,
  syncInterval,
  ...props
}: FlatListProps<ItemT> & { ref?: Ref<RNFlatList> }) => {
  const { onScroll, syncRef, setActive } = useScrollSync({
    syncKey,
    syncInterval,
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

  useImperativeHandle(syncRef, () => ({
    scrollTo(offset) {
      ref.current?.scrollToOffset({ offset, animated: false });
    },
  }));

  return (
    <RNFlatList
      scrollEventThrottle={16}
      {...props}
      ref={ref}
      onScrollBeginDrag={(e) => {
        setActive();
        props.onScrollBeginDrag?.(e);
      }}
      onScroll={(e) => {
        onScroll(e);
        props.onScroll?.(e);
      }}
    />
  );
};

export type ScrollView = RNScrollView;
export type ScrollViewProps = RNScrollViewProps & ScrollSyncProps;
export const ScrollView = ({
  syncInterval,
  syncKey,
  ...props
}: ScrollViewProps & {
  ref?: Ref<RNScrollView>;
}) => {
  const { onScroll, syncRef, setActive } = useScrollSync({
    syncKey,
    syncInterval,
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

  useImperativeHandle(syncRef, () => ({
    scrollTo(offset) {
      ref.current?.scrollTo({ y: offset, animated: false });
    },
  }));

  return (
    <RNScrollView
      scrollEventThrottle={16}
      {...props}
      ref={ref}
      onScrollBeginDrag={(e) => {
        setActive();
        props.onScrollBeginDrag?.(e);
      }}
      onScroll={(e) => {
        onScroll(e);
        props.onScroll?.(e);
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
  ...props
}: SectionListProps<ItemT, SectionT> & {
  ref?: Ref<RNSectionList<ItemT, SectionT>>;
}) => {
  const { onScroll, syncRef, setActive } = useScrollSync({
    syncKey,
    syncInterval,
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

  useImperativeHandle(syncRef, () => ({
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
      {...props}
      ref={ref}
      onScrollBeginDrag={(e) => {
        setActive();
        props.onScrollBeginDrag?.(e);
      }}
      onScroll={(e) => {
        onScroll(e);
        props.onScroll?.(e);
      }}
    />
  );
};
