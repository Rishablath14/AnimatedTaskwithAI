import { useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import TaskContext from '../contexts/TaskProvider';

const AiGenerator = () => {
  const { setNewTask, setNewTaskDesc } = useContext(TaskContext);  
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  const handleUse = (title, desc) => {
    setNewTask(title);
    setNewTaskDesc(desc);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generatewithai`);
    const data = await res.json();
    setGenerated(JSON.parse(data));
    setLoading(false);
  };

  const handleClear = () => {
    setGenerated([]);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          className="fixed bottom-12 right-4 p-2 shadow-md bg-gradient-to-br from-green-200 via-green-300 to-green-300 hover:from-green-300 hover:via-green-300 font-semibold hover:to-green-300 transition-all z-50"
          onClick={() => setIsOpen(true)}
        >
          Open AI Helper
        </button>
      )}
      <div
        ref={popupRef}
        className={`fixed bottom-4 min-h-[350px] right-0 bg-[#ffffffe5] rounded-md dark:bg-zinc-900 shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-80 md:w-[550px] lg:w-[800px] p-4 z-40`}
      >
        <button
          className="absolute rounded-full text-white top-2 right-4 p-[2px] px-2 shadow-md bg-gradient-to-br from-red-400 via-red-450 to-red-500 hover:from-red-300 hover:via-red-350 font-bold hover:to-red-400 transition-all"
          onClick={() => setIsOpen(false)}
        >
          X
        </button>
        <div className="flex flex-col gap-4 justify-center items-center w-full px-0 py-4 mt-4">
          <div className="mb-2">
            <button
              disabled={loading}
              className="p-2 shadow-md bg-gradient-to-br from-blue-200 via-purple-300 to-blue-300 hover:from-purple-300 hover:via-blue-300 font-semibold hover:to-purple-300 transition-all"
              onClick={handleGenerate}
            >
              {loading ? "Generating..." : "Generate with AI"}
            </button>
            {generated.length > 0 && (
              <button
                className="p-2 ml-4 shadow-md bg-gradient-to-br from-red-200 via-red-300 to-red-300 hover:from-red-300 hover:via-red-300 font-semibold hover:to-red-300 transition-all"
                onClick={handleClear}
              >
                Clear
              </button>
            )}
          </div>
          {generated.length > 0 && (
            <div className="flex flex-col justify-center max-h-screen items-center gap-1 w-full overflow-auto no-scrollbar">
              <AnimatePresence>
                {generated.map((task, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.5 }}
                    className="border bg-white dark:bg-zinc-900 dark:text-white w-full p-2 rounded-md shadow-md text-sm"
                  >
                    <b>Title</b>:&nbsp;{task.title}&nbsp;
                    <span
                      className="cursor-pointer group"
                      onClick={() => {
                        navigator.clipboard.writeText(task.title);
                      }}
                    >
                      <span className="group-active:hidden inline-block">
                        &#10063;
                      </span>
                      <span className="group-active:inline-block hidden text-black">
                        &#10004;
                      </span>
                    </span>
                    <br />
                    <b>Description</b>:&nbsp;{task.description}&nbsp;
                    <span
                      className="cursor-pointer group mr-4"
                      onClick={() => {
                        navigator.clipboard.writeText(task.description);
                      }}
                    >
                      <span className="group-active:hidden inline-block">
                        &#10063;
                      </span>
                      <span className="group-active:inline-block hidden text-black">
                        &#10004;
                      </span>
                    </span>
                    <button
                      className="p-1 text-xs md:text-sm border my-1 rounded-md bg-orange-400 shadow-md text-white font-bold hover:scale-105 transition-all"
                      onClick={() => handleUse(task.title, task.description)}
                    >
                      Add
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AiGenerator;
