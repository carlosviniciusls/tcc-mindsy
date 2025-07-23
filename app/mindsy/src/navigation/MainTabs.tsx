// src/navigation/MainTabs.tsx

import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import Home from '../screens/Main/Home';
import Mapa from '../screens/Main/Mapa';
import FavoritosStack from './FavoritosStack';
import ProfileStack from './ProfileStack'
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
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.barContainer}>
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
            <Pressable
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
            >
              <Icon
                size={28}
                weight={isFocused ? 'fill' : 'regular'}
                color={isFocused ? color : '#ccc'}
              />
              <Text style={[styles.label, { color: isFocused ? color : '#ccc' }]}>
                {route.name}
              </Text>
              {isFocused && (
                <View style={[styles.highlight, { backgroundColor: color }]} />
              )}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Mapa" component={Mapa} />
      <Tab.Screen name="Buscar" component={BuscarStack} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favoritos" component={FavoritosStack} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.COLORS.PRETO,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.COLORS.PRETO,
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: theme.FONT_FAMILY.INST_SANS,
  },
  highlight: {
    position: 'absolute',
    bottom: -4,
    height: 4,
    width: '50%',
    borderRadius: 2,
  },
});
