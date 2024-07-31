import { useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import TaskContext from '../contexts/TaskProvider';

const TaskList = () => {
  const { filterTasks,tasks,filterStatus,setFilterStatus } = useContext(TaskContext);
  const taskDisplay = Array.isArray(filterTasks) ? filterTasks : [];
  return (
    <>
    {tasks.length > 0 && (
        <div className="my-4 mb-4 px-8 gap-1 md:gap-4 w-full flex justify-center dark:text-white items-center font-bold">
          <span className="mt-0 md:mt-6">Filter By: &nbsp;</span>
          <select
            className="bg-transparent dark:bg-zinc-900 w-full font-normal border border-black dark:border-white p-1 focus:outline-none"
            name="status"
            id="status"
            defaultValue={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="todo">To DO</option>
            <option value="inprogress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      )}
    <ul className="grid place-items-center grid-cols-1 gap-2 md:gap-4 p-4 pt-0 md:p-6 md:pt-0 lg:p-8 lg:pt-0 md:grid-cols-2 lg:grid-cols-3 z-10 relative">
      <AnimatePresence>
        {taskDisplay.map(task => (
            <TaskItem key={task._id} task={task} />
        ))}
      </AnimatePresence>
    </ul>
    </>
  );
};

export default TaskList;
