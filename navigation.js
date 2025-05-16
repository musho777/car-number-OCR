import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './src/page/home';
import { AddPhot } from './src/page/addPhoto';
import { EditPhoto } from './src/page/edit';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Search, Settings } from './assets/svg';
import { SettingsPage } from './src/page/settings';
import { Login } from './src/page/auth/login';
import { SearchPage } from './src/page/search';
import { Register } from './src/page/auth/register';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from './src/constants';

const Stack = createNativeStackNavigator();

export const Navigation = ()=> {

  const [loading,setLoading] = useState(true)
  const [initialRouteName,setInitialRouteName] = useState("login")

  const getUser = async()=>{
    setLoading(true)
    let token = await AsyncStorage.getItem("token")
    if(token){
      setInitialRouteName("Home")
    }
    setLoading(false)
  } 

  useEffect(()=>{
    getUser()
  },[])

  if(loading){
    return <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator color={Color.button} />
    </View>
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
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
            // headerLeft: () => (
            //   <TouchableOpacity
            //     onPress={() => navigation.goBack("search")}
            //     style={{ marginLeft: 15 }}
            //   >
            //     <Search /> 
            //   </TouchableOpacity>
            // ),
          })}
          />
        
        <Stack.Screen name="addPhot" component={AddPhot} 
          options={{
            headerShown: false,
            presentation:"modal"
          }}
        />
          
          <Stack.Screen name="login" component={Login} 
          options={{
            headerShown: false,
          }}
        />
         
         <Stack.Screen name="register" component={Register} 
          options={{
            headerShown: false,
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
        <Stack.Screen name="search" component={SearchPage } 
          options={{
            headerShown: false,
            presentation:"modal"
          }}
        />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
