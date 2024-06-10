import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterNotes, setFilterNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newNoteDesc, setNewNoteDesc] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editText, setEditText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editDescText, setEditDescText] = useState("");
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");

  useEffect(() => {
    if (!token) navigate("/login");
    const getNotes = async () => {
      const res = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {localStorage.removeItem("token");navigate("/login")}
      const data = await res.json();
      setNotes(data);
    };
    getNotes();
  }, []);
  useEffect(() => {
    if (filterStatus === "all") {
      setFilterNotes(notes);
    } else {
      const filter = notes.filter((note) => note.status === filterStatus);
      setFilterNotes(filter);
    }
  }, [notes, filterStatus]);
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newNote && !newNoteDesc) {
      toast.error("Write both title and Description");
      return;
    }
    if (newNote && newNoteDesc) {
      const res = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newNote,
          desc: newNoteDesc,
          status: "todo",
          token,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes([...notes, data]);
        setNewNote("");
        setNewNoteDesc("");
        toast.success("Note Added");
      }
    }
  };
  const handleDelete = async (id) => {
    const prev = notes;
    const updatedNotes = notes.filter((note) => note._id !== id);
    setNotes(updatedNotes);
    const res = await fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setNotes([...prev]);
      toast.error("Error Deleting");
    } else {
      toast.success("Deleted Successfully");
    }
  };
  const handleEdit = (id, note) => {
    setEditText(note.title);
    setEditDescText(note.desc);
    setEditId(id);
  };
  const handleEditAdd = async (id) => {
    const prev = notes;
    notes.map((note) => {
      if (note._id == id) {
        note.title = editText;
        note.desc = editDescText;
      }
    });
    setEditId(-1);
    setNotes([...notes]);
    const res = await fetch(`http://localhost:5000/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editText, desc: editDescText }),
    });
    if (!res.ok) {
      setNotes([...prev]);
      toast.error("Failed to Edit");
    }
  };
  const handleChange = async (e, id) => {
    const prev = notes;
    notes.map((note) => {
      if (note._id === id) {
        note.status = e.target.value;
      }
    });
    setNotes([...notes]);
    const res = await fetch(`http://localhost:5000/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: e.target.value }),
    });
    if (!res.ok) {
      setNotes([...prev]);
      toast.error("Failed to Change");
    }
  };
  const handleLogout = async () => {
    const res = await fetch("http://localhost:5000/logout");
    if (res.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/login");
    }
  };
  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/generatewithai");
    const data = await res.json();
    setGenerated(JSON.parse(data));
    setLoading(false);
  };
  const handleClear = () => {
    setGenerated([]);
  };
  return (
    <div className="min-h-screen w-full relative z-10 bg-white bg-dot-black/[0.2]">
      <div className="flex w-full fixed justify-between items-center px-4 py-1 z-50 bg-white shadow-md">
        <img
          src="logo.png"
          alt="Logo"
          width={100}
          height={50}
          className="w-[45px] h-[45px] lg:ms-6"
        />
        <h2 className="md:text-lg font-bold mt-2">{userName}</h2>
        <button
          className="shadow-md bg-gray-900 text-white py-1 px-2 text-base font-bold lg:me-4 rounded-md hover:text-white hover:bg-gray-800 transition-all w-auto"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <form
        className="w-full pt-16 px-8 lg:w-auto z-10 relative"
        onSubmit={handleAdd}
      >
        <fieldset className="my-4 w-full lg:w-auto gap-4 flex flex-col lg:flex-row items-center justify-center pe-8 border p-4 border-black">
          <legend>Add New Task</legend>
          <label htmlFor="note" className="">
            Title:
          </label>
          <input
            type="text"
            id="note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="rounded border border-black focus:border-none p-1 focus:outline-dashed w-full"
          />
          <label htmlFor="desc" className="">
            Description:
          </label>
          <input
            type="text"
            id="desc"
            value={newNoteDesc}
            onChange={(e) => setNewNoteDesc(e.target.value)}
            className="rounded border border-black focus:border-none p-1 focus:outline-dashed w-full"
          />
          <button
            type="submit"
            className="p-2 w-full lg:w-auto rounded-md shadow bg-gray-900 hover:bg-gray-800 text-white font-semibold"
          >
            Add
          </button>
        </fieldset>
      </form>
      <div className="flex flex-col gap-4 justify-center items-center w-full px-6 border border-gray-400 py-4">
        <div>
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
        {generated.length > 0 && 
        <div className="flex flex-col justify-center items-center gap-1 w-full">
          {generated.map((note, idx) => (
            <div
              key={idx}
              className="border bg-white w-full p-1 rounded-md shadow-md text-sm"
            >
              <b>Title</b>:&nbsp;{note.title}&nbsp;
              <span
                className="cursor-pointer group"
                onClick={() => {
                  navigator.clipboard.writeText(note.title);
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
              <b>Description</b>:&nbsp;{note.description}
              <span
                className="cursor-pointer group"
                onClick={() => {
                  navigator.clipboard.writeText(note.description);
                }}
              >
                <span className="group-active:hidden inline-block">
                  &#10063;
                </span>
                <span className="group-active:inline-block hidden text-black">
                  &#10004;
                </span>
              </span>
            </div>
          ))}
        </div>
      }
      </div>
      {notes.length > 0 && (
        <div className="my-4 mb-2 px-8 gap-1 md:gap-4 w-full flex justify-center items-center font-bold">
          <span className="mt-0 md:mt-6">Filter By: &nbsp;</span>
          <select
            className="bg-transparent w-full font-normal border border-black p-1 focus:outline-none"
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
          {filterNotes.map((note) => (
            <motion.div
              key={note._id}
              layout
              className={`w-full relative h-full overflow-auto ${
                note.status === "todo"
                  ? "bg-[#ebebebdb]"
                  : note.status === "done"
                  ? "bg-[#3df53dcd]"
                  : "bg-[#f5f51edc]"
              } shadow-lg flex flex-col justify-between rounded-md p-2`}
              initial={{ opacity: 0.3, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                y: 50,
                opacity: 0.2,
                scale: 0.6,
                transition: { duration: 0.9, delay: 0.1 },
              }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.3, delay: 0.3 },
                }}
                exit={{
                  scale: 0,
                  opacity: 0.2,
                  transition: { duration: 0.4, delay: -0.3 },
                }}
                className="absolute w-3 left-[50%] -translate-x-[50%] h-3 shadow-md rounded-full bg-gradient-to-br from-gray-500 via-white to-slate-800"
              ></motion.span>
              {editId !== note._id ? (
                <li className="text-black mt-3 text-xl font-bold p-1 max-h-8 overflow-auto no-scrollbar">
                  {note.title}
                </li>
              ) : (
                <input
                  type="text"
                  value={editText}
                  autoFocus
                  className="focus:outline-none bg-[#fff] text-black font-bold p-1 text-xl w-full shadow-md mt-3 mb-2"
                  onChange={(e) => {
                    setEditText(e.target.value);
                  }}
                />
              )}
              {editId !== note._id ? (
                <li className="text-black text-base p-1 mb-4 max-h-16 overflow-auto no-scrollbar">{note.desc}</li>
              ) : (
                <input
                  type="text"
                  value={editDescText}
                  autoFocus
                  className="focus:outline-none bg-[#fff] text-black p-1 text-base w-full shadow-md mb-4"
                  onChange={(e) => {
                    setEditDescText(e.target.value);
                  }}
                />
              )}
              <div className="flex items-center justify-between">
                <div className="relative w-full h-full">
                  <span className="absolute bg-transparent font-bold text-gray-800 backdrop-blur-md p-1 rounded-full text-sm px-2 -top-3 left-2">
                    status
                  </span>
                  <select
                    className="bg-transparent border rounded-3xl border-black p-1 pt-3 pb-2 focus:outline-none"
                    name="status"
                    id="status"
                    defaultValue={note.status}
                    onChange={(e) => {
                      handleChange(e, note._id);
                    }}
                  >
                    <option value="todo">To DO</option>
                    <option value="inprogress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="flex gap-2 items-center p-2">
                  {editId !== note._id ? (
                    <button
                      className="p-2 rounded-full text-white bg-green-700 hover:bg-green-600"
                      onClick={() => handleEdit(note._id, note)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="20"
                        height="20"
                        viewBox="0 0 50 50"
                      >
                        <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                      </svg>
                    </button>
                  ) : (
                    <button
                      className="rounded-full text-white bg-green-700 hover:bg-green-600 text-2xl px-3 py-1"
                      onClick={() => handleEditAdd(note._id)}
                    >
                      +
                    </button>
                  )}
                  <button
                    className="p-2 rounded-full text-white bg-red-700 hover:bg-red-600"
                    onClick={() => handleDelete(note._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="20"
                      height="20"
                      viewBox="0 0 50 50"
                    >
                      <path d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default Notes;
