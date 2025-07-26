import { Text, StyleSheet, Pressable, Image, View } from 'react-native';
import { ScrollView } from 'react-native-scroll-sync';
import { colors } from '../colors';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function App() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top || 16, paddingBottom: insets.bottom || 16 },
      ]}
    >
      <Image
        source={require('../../assets/github-header-image.png')}
        style={styles.logo}
      />
      <View style={styles.flex} />
      <Link href="/simple" asChild>
        <Button onPress={() => {}} color={colors.red}>
          simple
        </Button>
      </Link>
      <Link href="/horizontal" asChild>
        <Button onPress={() => {}} color={colors.blue}>
          horizontal
        </Button>
      </Link>
      <Link href="/synckey" asChild>
        <Button onPress={() => {}} color={colors.red}>
          syncKey
        </Button>
      </Link>
      <Link href="/syncinterval" asChild>
        <Button onPress={() => {}} color={colors.blue}>
          syncInterval
        </Button>
      </Link>
      <Link href="/synctype" asChild>
        <Button onPress={() => {}} color={colors.red}>
          syncType
        </Button>
      </Link>
      <Link href="/header" asChild>
        <Button onPress={() => {}} color={colors.blue}>
          header
        </Button>
      </Link>
      <View style={styles.flex} />
    </ScrollView>
  );
}

const Button = ({
  children,
  onPress,
  color,
}: {
  children: React.ReactNode;
  onPress: () => void;
  color: string;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: color }]}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  flex: {
    flex: 1,
  },
  logo: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  button: {
    height: 100,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
