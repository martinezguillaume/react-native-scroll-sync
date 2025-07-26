import { StyleSheet, View } from 'react-native';
import { SyncScrollView } from '../components';
import { colors } from '../colors';

export default function Simple() {
  return (
    <View style={styles.container}>
      <SyncScrollView color={colors.blue} />
      <SyncScrollView color={colors.blue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
