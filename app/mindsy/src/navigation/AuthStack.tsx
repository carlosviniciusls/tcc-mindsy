import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Auth/Splash';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
