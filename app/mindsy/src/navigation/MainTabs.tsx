// src/navigation/MainTabs.tsx

import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { theme } from '../theme';
import Home from '../screens/Main/Home';
import Mapa from '../screens/Main/Mapa';
import FavoritosStack from './FavoritosStack';
import Perfil from '../screens/Main/Perfil';
import BuscarStack from './BuscarStack';

import {
  HouseIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  UserIcon,
} from 'phosphor-react-native';

const Tab = createBottomTabNavigator();

const tabs = {
  Home: { icon: HouseIcon, color: theme.COLORS.BLUE },
  Buscar: { icon: MagnifyingGlassIcon, color: theme.COLORS.VERMELHO },
  Mapa: { icon: MapPinIcon, color: theme.COLORS.VERDE },
  Favoritos: { icon: StarIcon, color: theme.COLORS.AMARELO },
  Perfil: { icon: UserIcon, color: theme.COLORS.ROXO },
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: theme.COLORS.PRETO }}>
      <BarContainer>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { icon: Icon, color } = tabs[route.name as keyof typeof tabs];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem key={route.key} onPress={onPress}>
              <Icon
                size={28}
                weight={isFocused ? 'fill' : 'regular'}
                color={isFocused ? color : '#ccc'}
              />
              <Label style={{ color: isFocused ? color : '#ccc' }}>
                {route.name}
              </Label>
              {isFocused && <Highlight style={{ backgroundColor: color }} />}
            </TabItem>
          );
        })}
      </BarContainer>
    </SafeAreaView>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={ props => <CustomTabBar {...props} /> }>
      <Tab.Screen name="Mapa" component={Mapa} />
      <Tab.Screen name="Buscar" component={BuscarStack} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favoritos" component={FavoritosStack} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

const BarContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: ${theme.COLORS.PRETO};
  padding: 8px 0;
`;

const TabItem = styled(Pressable)`
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Label = styled.Text`
  margin-top: 4px;
  font-size: 10px;
  font-family: ${theme.FONT_FAMILY.INST_SANS};
`;

const Highlight = styled.View`
  position: absolute;
  bottom: -4px;
  height: 4px;
  width: 50%;
  border-radius: 2px;
`;
