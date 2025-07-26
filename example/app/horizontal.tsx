import { StyleSheet, View } from 'react-native';
import { SyncFlatList, SyncScrollView } from '../components';
import { colors } from '../colors';

export default function SyncKey() {
  return (
    <View style={styles.container}>
      <SyncScrollView
        syncKey="one"
        horizontal
        color={colors.blue}
        syncInterval={[0, 200]}
        isSyncIntervalVisible
      />
      <SyncScrollView
        syncKey="two"
        horizontal
        color={colors.red}
        syncInterval={[300, 400]}
        isSyncIntervalVisible
      />
      <SyncScrollView syncKey="one" horizontal color={colors.blue} />
      <SyncScrollView syncKey="two" horizontal color={colors.red} />
      <SyncFlatList syncKey="one" horizontal color={colors.blue} />
      <SyncFlatList syncKey="two" horizontal color={colors.red} />
      <SyncFlatList syncKey="one" horizontal color={colors.blue} />
      <SyncFlatList syncKey="two" horizontal color={colors.red} />
      <SyncFlatList syncKey="one" horizontal color={colors.blue} />
      <SyncFlatList syncKey="two" horizontal color={colors.red} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
