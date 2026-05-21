import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [habitTitle, setHabitTitle] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data.tasks);
  };

  const fetchHabits = async () => {
    const res = await API.get("/habits");
    setHabits(res.data.habits);
  };

  const fetchNotes = async () => {
    const res = await API.get("/notes");
    setNotes(res.data.notes);
  };

  const fetchGoals = async () => {
    const res = await API.get("/goals");
    setGoals(res.data.goals);
  };

  const createTask = async () => {
    if (!taskTitle.trim()) return;
    await API.post("/tasks", { title: taskTitle });
    setTaskTitle("");
    fetchTasks();
  };

  const createHabit = async () => {
    if (!habitTitle.trim()) return;
    await API.post("/habits", { title: habitTitle });
    setHabitTitle("");
    fetchHabits();
  };

  const createNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    await API.post("/notes", { title: noteTitle, content: noteContent });
    setNoteTitle("");
    setNoteContent("");
    fetchNotes();
  };

  const createGoal = async () => {
    if (!goalTitle.trim() || !goalTarget.trim()) return;
    await API.post("/goals", {
      title: goalTitle,
      target: Number(goalTarget),
    });
    setGoalTitle("");
    setGoalTarget("");
    fetchGoals();
  };

  const toggleTask = async (id: string, completed: boolean) => {
    await API.put(`/tasks/${id}`, { completed: !completed });
    fetchTasks();
  };

  const toggleHabit = async (id: string, completed: boolean) => {
    await API.put(`/habits/${id}`, { completed: !completed });
    fetchHabits();
  };

  const updateGoalProgress = async (
    id: string,
    progress: number,
    target: number
  ) => {
    const newProgress = Math.min(progress + 10, target);
    await API.put(`/goals/${id}`, { progress: newProgress });
    fetchGoals();
  };

  const deleteTask = async (id: string) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const deleteHabit = async (id: string) => {
    await API.delete(`/habits/${id}`);
    fetchHabits();
  };

  const deleteNote = async (id: string) => {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  const deleteGoal = async (id: string) => {
    await API.delete(`/goals/${id}`);
    fetchGoals();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchTasks();
    fetchHabits();
    fetchNotes();
    fetchGoals();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const completedHabits = habits.filter((habit) => habit.completed).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">LifeOS</h1>
            <p className="text-gray-400 mt-1">
              Your personal productivity command center
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Tasks</p>
            <h2 className="text-3xl font-bold">{tasks.length}</h2>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Completed Tasks</p>
            <h2 className="text-3xl font-bold">{completedTasks}</h2>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Habits Done</p>
            <h2 className="text-3xl font-bold">
              {completedHabits}/{habits.length}
            </h2>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Notes</p>
            <h2 className="text-3xl font-bold">{notes.length}</h2>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Goals</p>
            <h2 className="text-3xl font-bold">{goals.length}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-2xl font-semibold mb-4">Tasks</h2>

            <div className="flex gap-2 mb-5">
              <input
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Add a new task..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <button
                onClick={createTask}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold"
              >
                Add
              </button>
            </div>

            {tasks.length === 0 ? (
              <p className="text-gray-500">No tasks yet.</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex justify-between items-center gap-3"
                  >
                    <span
                      className={
                        task.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      {task.title}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleTask(task.id, task.completed)}
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-2xl font-semibold mb-4">Habits</h2>

            <div className="flex gap-2 mb-5">
              <input
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 outline-none focus:border-purple-500"
                placeholder="Add a habit..."
                value={habitTitle}
                onChange={(e) => setHabitTitle(e.target.value)}
              />
              <button
                onClick={createHabit}
                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-semibold"
              >
                Add
              </button>
            </div>

            {habits.length === 0 ? (
              <p className="text-gray-500">No habits yet.</p>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex justify-between items-center gap-3"
                  >
                    <span
                      className={
                        habit.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      {habit.title}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleHabit(habit.id, habit.completed)}
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-2xl font-semibold mb-4">Notes</h2>

            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mb-3 outline-none focus:border-green-500"
              placeholder="Note title..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />

            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mb-3 outline-none focus:border-green-500 min-h-24"
              placeholder="Write your note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />

            <button
              onClick={createNote}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold mb-5"
            >
              Add Note
            </button>

            {notes.length === 0 ? (
              <p className="text-gray-500">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-3"
                  >
                    <div className="flex justify-between gap-3">
                      <h3 className="font-semibold">{note.title}</h3>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-2xl font-semibold mb-4">Goals</h2>

            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mb-3 outline-none focus:border-yellow-500"
              placeholder="Goal title..."
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
            />

            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mb-3 outline-none focus:border-yellow-500"
              placeholder="Target, e.g. 100"
              type="number"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
            />

            <button
              onClick={createGoal}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold mb-5"
            >
              Add Goal
            </button>

            {goals.length === 0 ? (
              <p className="text-gray-500">No goals yet.</p>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => {
                  const percentage =
                    goal.target > 0
                      ? Math.min((goal.progress / goal.target) * 100, 100)
                      : 0;

                  return (
                    <div
                      key={goal.id}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-3"
                    >
                      <div className="flex justify-between gap-3">
                        <h3 className="font-semibold">{goal.title}</h3>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>

                      <p className="text-gray-400 text-sm mt-2">
                        {goal.progress}/{goal.target}
                      </p>

                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <button
                        onClick={() =>
                          updateGoalProgress(
                            goal.id,
                            goal.progress,
                            goal.target
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded mt-3"
                      >
                        +10 Progress
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;