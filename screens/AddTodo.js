import React, { useState } from 'react';
import * as Notifications from 'expo-notifications';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { addTodoReducer } from '../redux/todosSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddTodo = () => {
  const navigation = useNavigation()
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [isToday, setIsToday] = useState(false);
  const [withAlert, setWithAlert] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const darkMode = useSelector((state) => state.profile.darkMode);
  const listTodos = useSelector(state => state.todos.todos)
  const dispatch = useDispatch();
  const addTodo = async () =>{
    const newTodo ={
      id: Math.floor(Math.random() * 1000000),
      text: name,
      hour: isToday? date.toISOString() : new Date(date).getTime() + 24 * 60 * 60 * 1000,
      isToday: isToday,
      isCompleted: false,
    }
    try{
      await AsyncStorage.setItem('@Todos', JSON.stringify([...listTodos, newTodo]))
      dispatch(addTodoReducer(newTodo))
      console.log('Todo saved correctly')
      console.log(newTodo)
      if(withAlert){
        await scheduleTodoNotification(newTodo)
      }
      navigation.goBack()
    }
    catch(e){
      console.log(e)
    }
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    setDate(selectedDate || date);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const scheduleTodoNotification = async (todo) => {
    const trigger = new Date(todo.hour);
  
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "It's time!",
          body: todo.text,
        },
        trigger,
      });
    } catch (error) {
      alert('La hora no es válida');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container2, {backgroundColor: darkMode? '#141414' : 'white'}]}>
      <Text style={[styles.title, {color: darkMode? 'white' : 'black'}]}>Add Task</Text>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputTitle, {color: darkMode? 'white' : 'black'}]}>Name</Text>
        <TextInput
          style={[styles.textInput, {color: darkMode? 'white' : 'black', borderBottomColor: darkMode? '#FFFFFF70':'#00000030'}]}
          placeholder="Task..."
          placeholderTextColor={darkMode? '#73737370' : 'black'}
          onChangeText={(text) => {
            setName(text);
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputTitle, {color: darkMode? 'white' : 'black'}]}>Hour</Text>
        <TouchableOpacity onPress={showDatepicker}>
          <Text style={{color: darkMode? 'white' : 'black'}}>{date.toLocaleTimeString()}</Text>
        </TouchableOpacity>
          {showDatePicker && (
            <TouchableOpacity style={styles.contenedorHora}>
              <DateTimePicker
                value={date}
                mode="time"
                is24Hour={true}
                display="clock"
                onChange={handleDateChange}
              />
            </TouchableOpacity>
            )}
      </View>
      <View style={styles.inputContainer}>
        <View style={{width: '70%'}}>
          <Text style={[styles.inputTitle, {color: darkMode? 'white' : 'black'}]}>Today</Text>  
          <Text style={{color:'#73737370'}}>If you disable today, the task will be considered as tomorrow</Text>
        </View>
        <Switch value={isToday} onValueChange={(value) => setIsToday(value)} />
      </View>
      <View style={styles.inputContainer}>
        <View style={{width: '70%'}}>
          <Text style={[styles.inputTitle, {color: darkMode? 'white' : 'black'}]}>Alert</Text>
          <Text style={{color:'#73737370'}}>You will receive an alert at the time you set for this reminder</Text>
        </View> 
          <Switch value={withAlert} onValueChange={(value) => setWithAlert(value)} />
      </View>
      <TouchableOpacity style={[styles.button, {backgroundColor: darkMode? 'white' : 'black'}]} onPress={addTodo}>
        <Text style={{color: darkMode? 'black' : 'white'}}>Done</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddTodo

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    container2: {
      flex: 1,
      paddingHorizontal: 30,
      paddingTop: 10
  },
    contenedorHora:{
      backgroundColor: 'white',
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 35,
        marginTop: 10,
    },
    inputTitle:{
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 24
    },
    textInput:{
        borderBottomWidth: 1,
        width: '80%'
    },
    inputContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 30,
    },
    button:{
        marginTop: 30,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        height: 46,
        borderRadius: 11,
    }
})