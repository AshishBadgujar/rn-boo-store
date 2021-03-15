import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Home from './screens/home';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CreateAd from './screens/createAd';
import Login from './screens/login';
import Signup from './screens/signup';
import Account from './screens/account';
import auth from '@react-native-firebase/auth';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ffc331',
  },
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="signup" component={Signup} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Create') {
            iconName = "pluscircleo"
          } else if (route.name === 'Account') {
            iconName = "user"
          }
          return <View style={{ borderWidth: 15, borderRadius: 30, borderColor: "#ffff", elevation: 4 }}><AntDesign style={{ borderWidth: 18, width: 30, borderColor: "#fff" }} name={iconName} color={color} size={35} /></View>;

        },
      })}
      tabBarOptions={{
        activeTintColor: '#ffc331',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: "" }} />
      <Tab.Screen name="Create" component={CreateAd} options={{ title: "" }} />
      <Tab.Screen name="Account" component={Account} options={{ title: "" }} />
    </Tab.Navigator>
  )
}
const Navigation = () => {
  const [user, setUser] = useState('')
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((userExist) => {
      if (userExist) {
        setUser(userExist)
      } else {
        setUser('')
      }
    })
    return unsubscribe
  }, [])
  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Navigation />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff"
  }
});

export default App;
