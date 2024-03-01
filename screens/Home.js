import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TodoList from '../components/TodoList';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hideCompletedReducer, setTodosReducer } from '../redux/todosSlice';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';


Notifications.setNotificationHandler({
  handleNotification: async () =>({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }
)})


export default function Home() {

  const [expoPushToken, setExpoPushToken] = useState(false)
  const todos = useSelector(state => state.todos.todos)
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const [isHidden, setIsHidden] = useState(false)
  const nameUser = useSelector((state) => state.profile.nameUser);
  const profileImage = useSelector((state) => state.profile.profileImage);
  const darkMode = useSelector((state) => state.profile.darkMode);


  const getTodos = async() => {
    try {
       const todos = await AsyncStorage.getItem('@Todos')
       console.log('Todos from AsyncStorage:', todos);
 
       if (todos !== null) {
          const todosData = JSON.parse(todos);
          console.log('Parsed Todos:', todosData);
 
          const todosDataFiltered = todosData.filter(todo => {
             return moment(new Date(todo.hour)).isSameOrAfter(moment(), 'day')
          });
 
          if (todosDataFiltered !== null) {
             await AsyncStorage.setItem('@Todos', JSON.stringify(todosDataFiltered));
             console.log('Deleted some passed todos');
          }
 
          dispatch(setTodosReducer(JSON.parse(todosDataFiltered)));
       }
    } catch (e) {
       console.log('Error in getTodos:', e);
    }
 }
 

  const handlePress = async () => {
    let updatedTodos;

    if (isHidden) {
        setIsHidden(false);
        const todos = await AsyncStorage.getItem('@Todos');
        if (todos !== null) {
            dispatch(setTodosReducer(JSON.parse(todos)));
        }
    } else {
        setIsHidden(true);
        dispatch(hideCompletedReducer());
        updatedTodos = JSON.stringify(todos); 
        try {
            await AsyncStorage.setItem('@Todos', updatedTodos);
        } catch (e) {
            console.log(e);
        }
    }
};

const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        alert('Failed to get push token for push notification. Permission not granted.');
        return;
      }
    }

    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      experienceId: '@toobbb/todolist',
    });

    const token = expoPushToken.data;
    console.log('Expo Push Token:', token);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('Error while registering for push notifications:', error);
    alert('Failed to get push token for push notification. An error occurred.');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container2, {backgroundColor: darkMode? '#141414' : 'white'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
            <Text style={ darkMode? {paddingRight: 2,color:'white'} : { paddingRight: 2}}>Hi, </Text><Text style={darkMode? {color:'white',fontWeight: 'bold', paddingRight:5} : {fontWeight: 'bold', paddingRight:5}}>{nameUser}!</Text>
            <TouchableOpacity onPress={()=> navigation.navigate('Profile')}>
              <Image
                source={{ uri: profileImage }}
                style={styles.pic}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.title, {color : darkMode ? 'white' : 'black'}]}>Today</Text>
            <TouchableOpacity onPress={handlePress}>
              <Text style={{ color: "#3478f6" }}>
                {isHidden ? "Show Completed" : "Hide Completed"}
              </Text>
            </TouchableOpacity>
          </View>
          <TodoList todosData={todos.filter((todo) => moment(new Date(todo.hour)).isSame(moment(), 'day'))} />
          <Text style={[styles.title,, {color : darkMode ? 'white' : 'black'}]}>Tomorrow</Text>
          <TodoList todosData={todos.filter((todo) => moment(new Date(todo.hour)).isAfter(moment(), 'day'))} />
          <TouchableOpacity style={[styles.button, {backgroundColor: darkMode? 'white': 'black'}]} onPress={()=> navigation.navigate('Add')}>
            <Text style={[styles.plus, {color: darkMode? 'black':'white'}]}>+</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container2: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10
    },
    pic: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignSelf: 'flex-end'
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 25,
        marginTop: 10
    },
    button: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 50,
        right: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .5,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    plus: {
        fontSize: 30,
        color: '#fff',
    }
});
