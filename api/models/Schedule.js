const Schedule = `
type Schedule {
    id: String
    month: Int
    date: Int
    hour: Int
    minute: Int
}
input ScheduleInput {
    id: String
    month: Int
    date: Int
    hour: Int
    minute: Int
}`

export default () => [Schedule]