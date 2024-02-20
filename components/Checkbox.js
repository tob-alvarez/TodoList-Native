import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { updateTodoReducer } from '../redux/todosSlice'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Checkbox = ({id, text, isCompleted, isToday, hour}) => {


  const dispatch = useDispatch();
  const listTodos = useSelector(state => state.todos.todos)

  const handleCheckbox = () =>{
    try {
      dispatch(updateTodoReducer({id, isCompleted}))
      AsyncStorage.setItem('@Todos', JSON.stringify(
        listTodos.map(todo => {
          if(todo.id === id){
            return{...todo, isCompleted: !todo.isCompleted}
          }
          return todo;
        })
        ))
        console.log('todo saved correctly')
    } catch (error) {
      console.log(error)
    }
  }

  return  isToday ? (
    <TouchableOpacity style={ isCompleted ? styles.checked : styles.unChecked} onPress={handleCheckbox}>
      {isCompleted && <Entypo name='check' size={16} color="#FAFAFA"/>}
    </TouchableOpacity>
  ) : (
    <View style={styles.isToday}>

    </View>
  )
}

export default Checkbox

const styles = StyleSheet.create({
    checked:{
        width: 20,
        height: 20,
        marginRight: 13,
        marginLeft: 15,
        borderRadius: 6,
        backgroundColor: '#262626',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset:{
            width: 0,
            height : 2,
        },
        shadowOpacity: .3,
        shadowRadius: 5,
        elevation: 5,
    },
    unChecked: {
        width: 20,
        height: 20,
        marginRight: 13,
        marginLeft: 15,
        borderColor: '#E8E8E8',
        borderRadius: 6,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset:{
            width: 0,
            height : 2,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
        elevation: 5,
    },
    isToday: {
        width: 20,
        height: 20,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#262626',
        marginRight: 13,
        marginLeft: 15,
    }
})