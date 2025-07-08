import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular: require('./src/assets/fonts/BebasNeue-Regular.ttf'),
    InstrumentsSans_500Medium: require('./src/assets/fonts/InstrumentSans-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Ou algum componente de loading
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'BebasNeue_400Regular', fontSize: 24 }}>
        Texto com Bebas Neue
      </Text>
      <Text style={{ fontFamily: 'InstrumentsSans_500Medium', fontSize: 24, marginTop: 20 }}>
        Texto com Instruments Sans
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
