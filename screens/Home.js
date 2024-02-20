import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TodoList from '../components/TodoList';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hideCompletedReducer, setTodosReducer } from '../redux/todosSlice';
import * as Notications from 'expo-notifications';
import * as Device from 'expo-device';
import moment from 'moment';


Notications.setNotificationHandler({
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


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))
    const getTodos = async() =>{
      try{
        const todos = await AsyncStorage.getItem('@Todos')
        if (todos !== null){
          const todosData = JSON.parse(todos)
          const todosDataFiltered = todosData.filter(todo => {
            return moment(new Date(todo.hour)).isSameOrAfter(moment(), 'day')
          })
          if(todosDataFiltered !== null){
            await AsyncStorage.setItem('@Todos', JSON.stringify(todosDataFiltered));
            console.log('we deleted some passed todos')
          }
          dispatch(setTodosReducer(JSON.parse(todosDataFiltered)))
        }
      }catch(e){
        console.log(e)
      }
    }
    getTodos();
  }, [])
  

  const navigation = useNavigation();
  const [isHidden, setIsHidden] = useState(false)

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

  const registerForPushNotificationsAsync = async () =>{
    let token;
    if (Device.isDevice){
      const {status : existingStatus} = await Notications.getPresentedNotificationsAsync();
      let finalStatus = existingStatus;
      if( existingStatus !== 'granted'){
        const {status} = await Notications.requestPermissionsAsync()
        finalStatus = status;
      }
      if( finalStatus !== 'granted'){
        alert('Failed to get push token for push notification!')
        return
      } 
      token= (await Notications.getExpoPushTokenAsync()).data;
      console.log(token)
    } else { return; }
    if(Platform.OS === 'android'){
      Notications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C'
      })
    }
    return token;
  } 

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.imgur.com/UOVSGbo.png" }}
        style={styles.pic}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>Today</Text>
        <TouchableOpacity onPress={handlePress}>
          <Text style={{ color: "#3478f6" }}>
            {isHidden ? "Show Completed" : "Hide Completed"}
          </Text>
        </TouchableOpacity>
      </View>
      <TodoList todosData={todos.filter((todo) => moment(new Date(todo.hour)).isSame(moment(), 'day'))} />
      <Text style={styles.title}>Tomorrow</Text>
      <TodoList todosData={todos.filter((todo) => moment(new Date(todo.hour)).isAfter(moment(), 'day'))} />
      <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('Add')}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 15,
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
        width: 42,
        height: 42,
        borderRadius: 21,
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
        alignItems: 'center'
    },
    plus: {
        fontSize: 40,
        color: '#fff',
        top: -7
    }
});
