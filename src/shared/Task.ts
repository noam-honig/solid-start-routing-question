import { Allow, Entity, Fields } from "remult"

@Entity("tasks", {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: "admin",
  allowApiDelete: "admin",
})
export class Task {
  @Fields.cuid()
  id = ""

  @Fields.string<Task>({
    validate: (task) => task.title.length > 2 || "Too Short",
    allowApiUpdate: "admin",
  })
  title = ""

  @Fields.boolean()
  completed = false

  @Fields.createdAt()
  createdAt?: Date
}
