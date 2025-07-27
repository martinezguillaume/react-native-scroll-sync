import { StyleSheet, View } from 'react-native';
import { SyncScrollView } from '../components';
import { colors } from '../colors';

export default function SyncType() {
  return (
    <View style={styles.container}>
      <SyncScrollView
        isSyncIntervalVisible
        syncInterval={[0, 200]}
        syncType="absolute"
        color={colors.blue}
        title="ABSOLUTE"
      />
      <SyncScrollView
        isSyncIntervalVisible
        syncInterval={[300, 500]}
        syncType="relative"
        color={colors.blue}
        title="RELATIVE"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
