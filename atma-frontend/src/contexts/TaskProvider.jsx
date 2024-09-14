/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [filterTasks, setFilterTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("token");
  

  useEffect(() => {
    if (!token) navigate("/login");
    const getTasks = async () => {
      try{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
          method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      setTasks(data);
    }catch(e){
      localStorage.removeItem("token");
      navigate("/login");
    }
    };
    getTasks();
  }, [token]);

  useEffect(() => {
    if (filterStatus === "all") {
      setFilterTasks(tasks);
    } else {
      const filtered = tasks.filter(task => task.status === filterStatus);
      setFilterTasks(filtered);
    }
  }, [tasks, filterStatus]);

  const handleAddTask = async (newTask, newTaskDesc) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTask,
        desc: newTaskDesc,
        status: "todo",
        token,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setTasks([...tasks, data]);
      toast.success("Task Added");
    } else {
      toast.error("Error Adding Task");
    }
  };

  const handleDeleteTask = async (id) => {
    const confirm = window.confirm("This Action is irreversible. Are you sure you want to delete this Task ?");
    if(!confirm) return;
    const prev = tasks;
    const updatedTasks = tasks.filter((task) => task._id !== id);
    setTasks(updatedTasks);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setTasks([...prev]);
      toast.error("Error Deleting");
    } else {
      toast.success("Deleted Successfully");
    }
  };

  const handleEditTask = async (id, editText, editDescText) => {
    const prev = tasks;
    const updatedTasks = tasks.map(task => {
      if (task._id === id) {
        return { ...task, title: editText, desc: editDescText };
      }
      return task;
    });
    setTasks(updatedTasks);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editText, desc: editDescText }),
    });
    if (!res.ok) {
      setTasks([...prev]);
      toast.error("Failed to Edit");
    }
  };

  const handleStatusChange = async (id, status) => {
    const prev = tasks;
    const updatedTasks = tasks.map(task => {
      if (task._id === id) {
        return { ...task, status };
      }
      return task;
    });
    setTasks(updatedTasks);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setTasks([...prev]);
      toast.error("Failed to Change Status");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        newTask,
        newTaskDesc,
        setNewTask,
        setNewTaskDesc,
        filterTasks,
        filterStatus,
        setFilterStatus,
        handleAddTask,
        handleDeleteTask,
        handleEditTask,
        handleStatusChange,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
