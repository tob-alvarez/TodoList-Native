import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Checkbox from './Checkbox'
import moment from 'moment'
import { EvilIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTodoReducer } from '../redux/todosSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Todo = ({id, text, isCompleted, isToday, hour}) => {

  const [localHour, setLocalHour] = useState(new Date(hour))
  const [thisTodoIsToday, setThisTodoIsToday] = hour ? useState(moment(new Date(hour)).isSame(moment(), 'day')) : useState(false)
  const todos = useSelector(state => state.todos.todos)
  const dispatch = useDispatch()
  const handleDeleteTodo = async() =>{
    dispatch(deleteTodoReducer(id))
    try {
      await AsyncStorage.setItem('@Todos', JSON.stringify(
        todos.filter(todo=> todo.id !== todo.id)
      ))
      console.log('Todo deleted correctly')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Checkbox id={id} text={text} isCompleted={isCompleted} isToday={thisTodoIsToday} hour={hour}/>
      <View>
        <Text style={ isCompleted ? styles.text2 : styles.text}>{text}</Text>
        <Text style={ isCompleted ? styles.hour2 : styles.hour}>{moment(localHour).format('LT')}</Text>
      </View>
      </View>
      <TouchableOpacity onPress={handleDeleteTodo} style={{alignItems: 'center'}}>
        <EvilIcons name="trash" size={30} color="#73737340" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Todo

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
        color: '#737373'
    },
    text2: {
        fontSize: 15,
        fontWeight: '500',
        color: '#73737330',
        textDecorationLine: 'line-through',
      },
      hour: {
        fontSize: 13,
        color: '#a3a3a3',
        fontWeight: '500'
      },
      hour2: {
        fontSize: 13,
        color: '#a3a3a350',
        textDecorationLine: 'line-through',
        fontWeight: '500'
    }
})