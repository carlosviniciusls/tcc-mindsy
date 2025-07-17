import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs'
import { useAuth } from '../contexts/AuthContext';

export default function Routes() {
  const { usuario } = useAuth();

  return (
    <NavigationContainer>
      {usuario ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
