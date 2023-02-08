import {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from './Components/Navbar';
import TasksList from './Components/TasksList';
import { createGlobalState } from 'react-hooks-global-state';
import { BsFillCalendarPlusFill } from 'react-icons/bs';
import {IoMdAddCircle} from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';


export const { useGlobalState } = createGlobalState({data: null});

export const checkTasks = () => {
  if(localStorage.getItem("storageTasks") === null)
    localStorage.setItem("storageTasks", "[]");
}

export const getTasks = () => {
  checkTasks();
  return JSON.parse(localStorage.getItem("storageTasks"));
}

export const updateTasks = (tasks) => {
  localStorage.setItem("storageTasks", JSON.stringify(tasks));
}

export const completeTask = (currentId, bool) => {
  const tasks = getTasks();
  tasks[currentId].iscompleted = bool;
  
  updateTasks(tasks);
}

export const getStorage = () => {
  if(localStorage.getItem("storageToken") === null)
    localStorage.setItem("storageToken", uuidv4());

  return localStorage.getItem("storageToken");
}

export const removeTask = (currentId) => {
  const tasks = getTasks();
  const newTasks = tasks.filter((task) => {
    return task.id !== currentId;
  });

  updateTasks(newTasks);
}

export const editTaskContent = (currentId, content, name) => {
  const tasks = getTasks();
  tasks[currentId].body = content;
  tasks[currentId].name = name;
  
  updateTasks(tasks);
}

function App() {
  const [name, setName] = useState('');
  const [data, setData] = useGlobalState('data');
  const [body, setBody] = useState('');

  useEffect(() => {
    setData(getTasks());
  }, [])


  const addTask = (name, body, datetime, iscompleted, token) => {
    checkTasks();
    const id = getTasks().length === 0 ? 0 : getTasks()[getTasks().length - 1].id + 1;
    const object = {id, name, body, datetime, iscompleted, token};
    const tasks = getTasks();
    tasks.push(object);
    updateTasks(tasks);
  }

  const submitTask = () =>{
    const currentDate = new Date();
    const cDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    const cTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    const datetime = cDate + ' ' + cTime;

    if(name === '' || body === ''){
      toast.error('Fill the blank fields');
    }else{
      addTask(name, body, datetime, false, getStorage());
      setData(getTasks());
      setName('');
      setBody('');
    }
  }

  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="addTask">
        <h1><BsFillCalendarPlusFill></BsFillCalendarPlusFill> Add ToDo:</h1>
        <ul className="task-option">
          <li>
            <label>Task name:</label>
            <input type="text"
            required value={name}
            onChange={(e) => setName(e.target.value)}></input>
          </li>

          <li>
            <label>Task description:</label>
            <textarea
            required value={body}
            onChange={(e) => setBody(e.target.value)}></textarea>
          </li>
          <Toaster />
          <button onClick={submitTask}><IoMdAddCircle></IoMdAddCircle> Add task</button>
        </ul>
      </div>
       {data && <TasksList data={data}></TasksList>}
    </div>
  );
}

export default App;
