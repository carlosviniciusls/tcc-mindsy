import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Perfil from '../screens/Main/Perfil'
import EditProfile from '../screens/Main/EditProfile'
import History from '../screens/Main/History'

export type ProfileStackParamList = {
  Perfil: undefined
  EditProfile: undefined
  History: undefined
}

const Stack = createNativeStackNavigator<ProfileStackParamList>()

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="History" component={History} />
    </Stack.Navigator>
  )
}
