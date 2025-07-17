import { ThemeProvider } from 'styled-components/native';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/theme';
import { AuthProvider } from './src/contexts/AuthContext';
import Routes from './src/navigation';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <StatusBar style="light" translucent />
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
