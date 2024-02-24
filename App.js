import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import Home from "./screens/Home";
import AddTodo from "./screens/AddTodo";
import { store, persistor } from "./redux/store";
import { Provider } from 'react-redux'
import Profile from "./screens/Profile";
import { PersistGate } from 'redux-persist/integration/react';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
            <Stack.Screen name='Add' component={AddTodo} options={{presentation: 'modal'}}/>
            <Stack.Screen name='Profile' component={Profile} options={{presentation: 'modal'}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

