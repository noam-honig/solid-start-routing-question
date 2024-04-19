import { repo } from "remult"
import { createStore } from "solid-js/store"
import { For, Show, createSignal, onCleanup, onMount } from "solid-js"
import { Task } from "../shared/Task.js"
import { TasksController } from "../shared/TasksController.js"

const taskRepo = repo(Task)

export default function Todo() {
  const [tasks, setTasks] = createStore<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = createSignal("")

  const addTask = async (e: Event) => {
    e.preventDefault()
    try {
      await taskRepo.insert({ title: newTaskTitle() })
      setNewTaskTitle("")
    } catch (error) {
      alert((error as { message: string }).message)
    }
  }
  async function setAllCompleted(completed: boolean) {
    TasksController.setAllCompleted(completed)
  }
  onMount(() =>
    onCleanup(
      taskRepo
        .liveQuery({
          limit: 20,
          orderBy: { createdAt: "asc" },
          //where: { completed: false },
        })
        .subscribe((info) => setTasks(info.applyChanges))
    )
  )
  return (
    <main>
      <Show when={taskRepo.metadata.apiInsertAllowed()}>
        <form onSubmit={addTask}>
          <input
            value={newTaskTitle()}
            placeholder="What needs to be done?"
            onInput={(e) => setNewTaskTitle(e.currentTarget.value)}
          />
          <button>Add</button>
        </form>
      </Show>
      <For each={tasks}>
        {(task, i) => {
          async function setCompleted(completed: boolean) {
            await taskRepo.update(task, { completed })
          }
          async function saveTask() {
            try {
              await taskRepo.save(task)
            } catch (error) {
              alert((error as { message: string }).message)
            }
          }
          async function deleteTask() {
            try {
              await taskRepo.delete(task)
            } catch (error) {
              alert((error as { message: string }).message)
            }
          }

          return (
            <div>
              <input
                type="checkbox"
                checked={task.completed}
                onInput={(e) => setCompleted(e.target.checked)}
              />
              <input
                value={task.title}
                onInput={(e) => setTasks(i(), "title", e.target.value)}
              />
              <button onClick={saveTask}>Save</button>
              <button onClick={deleteTask}>Delete</button>
            </div>
          )
        }}
      </For>
      <div>
        <button onClick={() => setAllCompleted(true)}>Set All Completed</button>
        <button onClick={() => setAllCompleted(false)}>
          Set All Uncompleted
        </button>
      </div>
    </main>
  )
}
