function RecentTaskList() {

    const recentTasks = [
        { id: 1, title: 'Task 1', status : 'In Progress'},
        { id: 2, title: 'Task 2', status : 'Pending' },
        { id: 3, title: 'Task 3', status : 'Completed' },
    ];
  return (
    <>
      <label>Recent Tasks</label>
      <div>
        {recentTasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
          </div>
        ))}
      </div>
    </>
  );
}
export default RecentTaskList;
