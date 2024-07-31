import { useContext } from 'react';
import TaskContext from '../contexts/TaskProvider';
import toast from 'react-hot-toast';

const TaskForm = () => {
  const { handleAddTask,newTask,newTaskDesc,setNewTask,setNewTaskDesc } = useContext(TaskContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask || !newTaskDesc) {
      toast.error("Write both title and Description");
      return;
    }
    handleAddTask(newTask, newTaskDesc);
    setNewTask('');
    setNewTaskDesc('');
  };

  return (
    <form
        className="w-full pt-16 px-8 lg:w-auto z-10 relative"
        onSubmit={handleSubmit}
      >
        <fieldset className="my-4 w-full lg:w-auto gap-4 flex flex-col lg:flex-row items-center justify-center pe-8 border p-4 dark:border-white border-black">
          <legend className='dark:text-white'>Add New Task</legend>
          <label htmlFor="task" className="dark:text-white">
            Title:
          </label>
          <input
            type="text"
            id="task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="rounded border border-black dark:border-white dark:bg-zinc-900 dark:text-white focus:border-none p-1 dark:focus:outline-white focus:outline-dashed w-full"
          />
          <label htmlFor="desc" className="dark:text-white">
            Description:
          </label>
          <input
            type="text"
            id="desc"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            className="rounded border border-black dark:border-white dark:bg-zinc-900 dark:text-white dark:focus:outline-white focus:border-none p-1 focus:outline-dashed w-full"
          />
          <button
            type="submit"
            className="p-2 w-full lg:w-auto rounded-md shadow bg-gray-900 dark:bg-slate-50 dark:text-black hover:bg-gray-800 text-white font-bold"
          >
            Add
          </button>
        </fieldset>
      </form>
  );
};

export default TaskForm;
