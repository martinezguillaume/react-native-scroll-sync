import { StyleSheet, View } from 'react-native';
import { SyncFlatList } from '../components';
import { colors } from '../colors';

export default function SyncKey() {
  return (
    <View style={styles.container}>
      <SyncFlatList syncKey="one" color={colors.blue} />
      <SyncFlatList syncKey="two" color={colors.red} />
      <SyncFlatList syncKey="one" color={colors.blue} />
      <SyncFlatList syncKey="two" color={colors.red} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
