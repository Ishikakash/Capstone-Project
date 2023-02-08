import { getTasks, completeTask, useGlobalState, getStorage, removeTask, editTaskContent} from "../App";
import { BsFillCalendarWeekFill } from 'react-icons/bs';
import {AiFillDelete, AiFillEdit} from 'react-icons/ai';
import {RiSave3Line} from 'react-icons/ri';
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

const TasksList = ({data}) => {
  const [jsonData, setData] = useGlobalState('data'); 
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState(false);

  const [realName, setRealName] = useState('');
  const [realContent, setRealContent] = useState('');

  function isEmptyOrSpace(str){
    return str === null || str.match(/^ *$/) !== null;
}

  return (
    <div className="tasks_list">
      <h1><BsFillCalendarWeekFill></BsFillCalendarWeekFill> TODO:</h1>
      <div className="container">
        {data && data.map(task => {
          if(task.token === getStorage())
            return (
              <div className="task" key={task.id}>
                <p className="small-text">Heading:</p>
                {(!edit || task.id !== editId ) && 
                <h2 id={"name-" + task.id}>{
                  realName === "" ? task.name : (edit && task.id === editId ? realName : task.name)}
                </h2>}
                {edit && task.id === editId && 
                <input type="text" value={realName} onChange={(e) => {
                  setRealName(e.target.value);}}>
                </input>}
                <p>{task.datetime}</p>
                <div className="completed">
                  <label htmlFor={"cb" + task.id}>Status: 
                    <span className={task.iscompleted ? "complete" : "todo"}>{task.iscompleted ? "COMPLETED" : "TODO"}</span>
                  </label>
                  <input type="checkbox" id={"cb" + task.id} checked={task.iscompleted} onChange={(e) => {
                    completeTask(task.id, e.target.checked);
                    setData(getTasks());}}>
                  </input>
                </div>
                {(!edit || task.id !== editId ) && <p className="task-content" id={"content-" + task.id}>{task.body}</p>}
                {edit && task.id === editId && 
                <textarea className="task-newcontent" value={realContent} onChange={(e) => {
                  setRealContent(e.target.value);}}>
                </textarea>}
                {(!edit || task.id !== editId ) && 
                <button className="edit-btn" onClick={() => {
                  setEditId(task.id);
                  setEdit(!edit); 
                  setRealName(task.name); 
                  setRealContent(task.body)}}>
                  <AiFillEdit></AiFillEdit> Edit</button>}

                {edit && task.id === editId && <button onClick={() => {
                  if(isEmptyOrSpace(realContent) ||isEmptyOrSpace(realName)){
                    toast.error('Fill the blank fields');
                  }else{
                    editTaskContent(task.id, realContent, realName);
                    setEditId(null);
                    setEdit(!edit);
                    setData(getTasks());
                  }
                }}><RiSave3Line></RiSave3Line> Save</button>}

                <button className="delete-btn" onClick={() => {
                  removeTask(task.id); setData(getTasks()); toast.success('Successfully deleted');}}>
                     <AiFillDelete></AiFillDelete> Delete task</button>
              </div>
            );
        })}
      </div>
    </div>
  );
}
 
export default TasksList;