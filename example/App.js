import { ExpoRoot } from 'expo-router';
import Head from 'expo-router/head';

export default function ExpoRouterApp() {
  return (
    <Head.Provider>
      <ExpoRoot context={require.context('./app', true)} location="/" />
    </Head.Provider>
  );
}
