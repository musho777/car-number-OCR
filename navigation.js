import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './src/page/home';
import { AddPhot } from './src/page/addPhoto';
import { EditPhoto } from './src/page/edit';
import { TouchableOpacity } from 'react-native';
import { Settings } from './assets/svg';
import { SettingsPage } from './src/page/settings';
import { Login } from './src/page/auth/login';

const Stack = createNativeStackNavigator();

export const Navigation = ()=> {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('settings')}
                style={{ marginRight: 15 }}
              >
                <Settings />
              </TouchableOpacity>
            ),
          })}
          />
          <Stack.Screen name="login" component={Login} 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="addPhot" component={AddPhot} 
          options={{
            headerShown: false,
            presentation:"modal"
          }}
        />
         <Stack.Screen name="edit" component={EditPhoto} 
          options={{
            headerShown: false,
            presentation:"modal"
          }}
        />
         <Stack.Screen name="settings" component={SettingsPage} 
          options={{
            headerShown: false,
            presentation:"modal"
          }}
        />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
