import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { initialData } from '../data/MockData';
import { Column } from './Column';
import type { KanbanData } from '../types/types';
import { HiOutlinePlusCircle } from 'react-icons/hi2';

const STORAGE_KEY = 'kanban-board-data';

export function Board() {
  const [data, setData] = useState<KanbanData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialData;
  });

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (isAddingColumn && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingColumn]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;

    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      setData({ ...data, columnOrder: newColumnOrder });
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  const addTask = (columnId: string, content: string) => {
    const taskId = `task-${Date.now()}`;
    const newTask = { id: taskId, content };

    const column = data.columns[columnId];
    const updatedTaskIds = [...column.taskIds, taskId];

    setData({
      ...data,
      tasks: { ...data.tasks, [taskId]: newTask },
      columns: {
        ...data.columns,
        [columnId]: { ...column, taskIds: updatedTaskIds },
      },
    });
  };

  const editTask = (taskId: string, newContent: string) => {
    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [taskId]: { ...data.tasks[taskId], content: newContent },
      },
    });
  };

  const deleteTask = (columnId: string, taskId: string) => {
    const column = data.columns[columnId];
    const updatedTaskIds = column.taskIds.filter(id => id !== taskId);
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [columnId]: { ...column, taskIds: updatedTaskIds },
      },
    });
  };

  const addColumn = (title: string) => {
    const columnId = `column-${Date.now()}`;
    const newColumn = { id: columnId, title, taskIds: [] };

    setData({
      ...data,
      columns: { ...data.columns, [columnId]: newColumn },
      columnOrder: [...data.columnOrder, columnId],
    });
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = { ...data.columns };
    const taskIdsToDelete = newColumns[columnId].taskIds;
    const newTasks = { ...data.tasks };

    taskIdsToDelete.forEach(id => delete newTasks[id]);
    delete newColumns[columnId];

    const newColumnOrder = data.columnOrder.filter(id => id !== columnId);

    setData({
      tasks: newTasks,
      columns: newColumns,
      columnOrder: newColumnOrder,
    });
  };

  const editColumnTitle = (columnId: string, newTitle: string) => {
    setData({
      ...data,
      columns: {
        ...data.columns,
        [columnId]: { ...data.columns[columnId], title: newTitle },
      },
    });
  };

  const handleAddColumn = () => {
    const trimmed = newColumnTitle.trim();
    if (trimmed) {
      addColumn(trimmed);
      setNewColumnTitle('');
    }
    setIsAddingColumn(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="flex gap-6 overflow-x-auto py-4"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {data.columnOrder.map((columnId, index) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
              return (
                <Draggable draggableId={columnId} index={index} key={columnId}>
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                    >
                      <Column
                        column={column}
                        tasks={tasks}
                        addTask={addTask}
                        editTask={editTask}
                        deleteTask={deleteTask}
                        deleteColumn={deleteColumn}
                        editColumn={editColumnTitle} 
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}

            <div className="min-w-[300px] p-4 bg-zinc-200 dark:bg-zinc-700 rounded-xl">
              {isAddingColumn ? (
                <>
                  <input
                    ref={inputRef}
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onBlur={() => {
                      if (!newColumnTitle.trim()) {
                        setIsAddingColumn(false);
                        setNewColumnTitle('');
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddColumn();
                      if (e.key === 'Escape') {
                        setIsAddingColumn(false);
                        setNewColumnTitle('');
                      }
                    }}
                    placeholder="New column title"
                    className="w-full p-2 rounded border text-sm"
                  />
                  <button
                    onClick={handleAddColumn}
                    className="mt-2 px-2 py-2 w-full bg-zinc-500 text-white rounded flex items-center gap-2"
                  >
                    <HiOutlinePlusCircle className="w-6 h-6" />
                    Add Column
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="w-full px-4 py-2 bg-zinc-600 hover:bg-zinc-500 text-white rounded flex items-center gap-2 justify-center"
                >
                  <HiOutlinePlusCircle className="w-6 h-6" />
                  Add Column
                </button>
              )}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
