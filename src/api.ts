import { getUser } from "./auth.js"
import { remultSolidStart } from "./remult-dev/remult-solid-start.js"
import { Task } from "./shared/Task.js"
import { TasksController } from "./shared/TasksController.js"

export const api = remultSolidStart({
  controllers: [TasksController],
  entities: [Task],
  admin: true,
  getUser,
})
