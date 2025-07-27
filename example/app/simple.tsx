import { StyleSheet, View } from 'react-native';
import { SyncFlatList, SyncScrollView, SyncSectionList } from '../components';
import { colors } from '../colors';

export default function Simple() {
  return (
    <View style={styles.container}>
      <SyncScrollView color={colors.blue} />
      <SyncFlatList color={colors.blue} />
      <SyncSectionList color={colors.blue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
});
