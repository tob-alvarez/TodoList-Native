// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, connect } from 'react-redux';
import { store } from './redux/store';
import Home from './screens/Home';
import AddTodo from './screens/AddTodo';
import Profile from './screens/Profile';
import { getHeaderStyles } from './styles';

const Stack = createNativeStackNavigator();

const App = ({ darkMode }) => {
  useEffect(() => {
    const headerOptions = getHeaderStyles(darkMode);

    Stack.Screen.defaultProps = {
      ...Stack.Screen.defaultProps,
      options: headerOptions,
    };
  }, [darkMode]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route }) => {
          const headerStyles = getHeaderStyles(darkMode);
          return {
            ...headerStyles,
          };
        }}
      >
        <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
        <Stack.Screen name='Add' component={AddTodo} options={{ presentation: 'modal', headerTitle:'' }} />
        <Stack.Screen name='Profile' component={Profile} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ConnectedApp = connect((state) => ({ darkMode: state.profile.darkMode }))(App);

const RootApp = () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);

export default RootApp;
