export interface Task {
  id: string;
  content: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanData {
  tasks: {
    [taskId: string]: Task;
  };
  columns: {
    [columnId: string]: Column;
  };
  columnOrder: string[];
}
