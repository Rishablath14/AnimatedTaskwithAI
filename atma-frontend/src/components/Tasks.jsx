import AiGenerator from "./AiGenerator";
import Header from "./Navbar";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

const Tasks = () => {
  
  return (
    <div className="min-h-screen w-full relative z-10 bg-white dark:bg-zinc-900 bg-dot-black/[0.2] dark:bg-dot-white/[0.2]">
      <Header/>
      <AiGenerator/>
      <TaskForm/>
      <TaskList/>
    </div>
  );
};

export default Tasks;
