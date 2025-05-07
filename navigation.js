import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './src/page/home';
import { AddPhot } from './src/page/addPhoto';

const Stack = createNativeStackNavigator();

export const Navigation = ()=> {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="addPhot" component={AddPhot} 
          options={{
            headerShown: false,
            presentation:"modal"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
