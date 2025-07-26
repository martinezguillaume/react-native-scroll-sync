import { StyleSheet, View } from 'react-native';
import { SyncScrollView } from '../components';
import { colors } from '../colors';

export default function SyncInterval() {
  return (
    <View style={styles.container}>
      <SyncScrollView syncInterval={[0, 200]} color={colors.blue} />
      <SyncScrollView syncInterval={[300, 500]} color={colors.blue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
