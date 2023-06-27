import React, { useState } from 'react';
import {SafeAreaView,StyleSheet,Text,View,TextInput, TouchableOpacity, FlatList, Alert, Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Color = {primary:'#190933',white:'#fff'};
const App = () => {
  const [textInput, setTextInput] = React.useState('');
  const [todos, setTodos] = React.useState([]);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [isInput, setInput] = useState();
  const [editItem, seteditItem] = useState();

  React.useEffect(()=>{
    getTodo();
  }, []);

  React.useEffect(()=>{
    saveTodo(todos);
  }, [todos]);

  const ListItem = ({todo}) => {
    return (
    <TouchableOpacity onPress = {() => openModal(todo?.id)}>
    <View style={styles.listItem}>
      <View style={{flex: 1}}>
        <Text style={{
        fontWeight:'bold', 
        fontSize: 15, 
        color: todo?.completed? 'gray': Color.primary, 
        textDecorationLine: todo?.completed?'line-through':'none'
        }}>
          {todo?.task}
        </Text>
      </View>
      {!todo?.completed && (
        <TouchableOpacity style={styles.actionIcon} onPress={()=>markComplete(todo?.id)}>
          <Icon name='done' size={20} color={Color.white}/>
        </TouchableOpacity>
        )
      }
      <TouchableOpacity style={[styles.actionIcon, {backgroundColor:'red'}]} onPress ={()=>delTodo(todo?.id)}> 
        <Icon name='delete' size={20} color={Color.white}/>
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  )};

  const saveTodo = async todos => {
    try{
      const stringifyTodos = JSON.stringify(todos)
      await AsyncStorage.setItem('todos', stringifyTodos)
    }catch (e){
      console.log(e);
      //saving error
    }
  };
  const getTodo = async()=>{
    try{
      const todos = await AsyncStorage.getItem('todos');
      if(todos != null){
        setTodos(JSON.parse(todos));
      }
    }catch(error){
      console.log(error);
    }
  }
  const addTodo = () =>{
    if(textInput == ""){
      Alert.alert("Error", "Please input todo");
    }
    else{
      //console.log(textInput);
      const newTodo ={
        id:Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };
  const markComplete = todoId=>{
    const newTodo = todos.map((item)=>{
      if(item.id == todoId){
        return{...item, completed:true}
      }
      return item;
    });
    setTodos(newTodo)
  };
  const delTodo = todoId => {
    const newTodo = todos.filter(item => item.id != todoId);
    setTodos(newTodo) 
  };
  const clear =()=>{
    Alert.alert("Confirm","Clear todos?",[{
      text:"Yes",
      onPress:() => setTodos([]),
    },
    {text: 'No'},
  ])
  };
  const openModal = todoId =>{
    //console.log("hi");
    setisModalVisible(true);
    //console.log(todoId);
    todos.map((item)=>{
      if(item.id == todoId){
        //console.log(item.task);
        setInput(item.task);
        seteditItem(item.id);
      }  
    });
  };
  const edit = () => {
    //console.log(editItem);
    if(isInput == ""){
      Alert.alert("Error", "Please input todo");
    }
    else{
    const newTodo = todos.map((item)=>{
      if(item.id == editItem){
        //console.log(isInput);
        return{...item,task:isInput};
      }return item;
    });
    setTodos(newTodo);
    setisModalVisible(false);  
  }}



  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ACFCD9'}}>
      <View style={styles.header}>
        <Text style={{fontWeight:'900', fontSize: 20, color:Color.primary, letterSpacing:5}}>TODO APP</Text>
        <Icon name="delete" size={25} color="red" onPress={clear}/>
      </View>
      
      <FlatList 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{padding: 20, paddingBottom:100}}
        data={todos} 
        renderItem={({item}) => <ListItem todo={item}/>}/>
        <Modal 
        animationType='fade'
        visible={isModalVisible}
        onRequestClose={() => setisModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={{fontSize:20,fontWeight:'bold',color:Color.primary}}>Change Text:</Text>
            <TextInput style={{backgroundColor:'#fff',borderRadius:10, marginVertical:20, fontWeight:'bold',fontSize:16}} placeholder="Add To Do" 
          value={isInput}
          onChangeText={text => setInput(text)}/>
          <TouchableOpacity style={styles.savebtn}
            onPress = {() => edit()}>
              <Text style={{color:Color.white, fontWeight:'bold', fontSize:16}}>Save</Text>
          </TouchableOpacity>
          </View>
        </Modal>
      <View style={styles.footer}>
        <View style={styles.inputContainter}>
          <TextInput placeholder="Add To Do" 
          value={textInput}
          onChangeText={text => setTextInput(text)}/>
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color={Color.white} size={30}/>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header:{
    padding:20,
    paddingTop:40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor:'#5dd9c1'//'#0077b6'
  },
  footer:{
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#665687',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  inputContainter:{
    backgroundColor: Color.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  iconContainer:{
    height: 50,
    width: 50,
    backgroundColor: "#5dd9c1",
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  listItem:{
    padding: 15,
    backgroundColor: Color.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
    marginBottom:0,
    borderBottomWidth: 5,
    borderBottomColor:'purple'
  },
  actionIcon:{
    height: 25,
    width: 25,
    backgroundColor: '#5dd9c1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3
  },
  modalContainer:{
    backgroundColor: '#5dd9c1',
    fontSize:30,
    borderRadius: 3,
    justifyContent: 'space-between',
    marginVertical:100,
    marginHorizontal:40,
    padding:20,
  },
  savebtn:{
    height:40,
    backgroundColor: "#665687",
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  }


});

export default App;
