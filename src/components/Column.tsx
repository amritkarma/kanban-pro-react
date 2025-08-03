import { Droppable } from '@hello-pangea/dnd';
import { Card } from './Card';
import type { Task, Column as ColumnType } from '../types/types';
import { useState, useEffect, useRef } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { HiOutlinePlusCircle, HiPencilSquare, HiTrash } from 'react-icons/hi2';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  addTask: (columnId: string, content: string) => void;
  editTask: (taskId: string, newContent: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  editColumn: (columnId: string, newTitle: string) => void;
  deleteColumn: (columnId: string) => void;
}

export function Column({
  column,
  tasks,
  addTask,
  editTask,
  deleteTask,
  editColumn,
  deleteColumn,
}: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [menuOpen, setMenuOpen] = useState(false);

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [tempCardContent, setTempCardContent] = useState('');
  const tempInputRef = useRef<HTMLInputElement | null>(null);

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const justClickedMenu = useRef(false);

  const handleSaveTitle = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== column.title) {
      editColumn(column.id, trimmed);
    }
    setIsEditingTitle(false);
  };

  useEffect(() => {
    if (!isEditingTitle) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (titleInputRef.current && !titleInputRef.current.contains(e.target as Node)) {
        handleSaveTitle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditingTitle, title]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleMenuClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (justClickedMenu.current) {
          justClickedMenu.current = false;
          return;
        }
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMenuClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleMenuClickOutside);
      justClickedMenu.current = false;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!isAddingCard) return;

    const handleClickOutsideTempCard = (e: MouseEvent) => {
      if (tempInputRef.current && !tempInputRef.current.contains(e.target as Node)) {
        const trimmed = tempCardContent.trim();
        if (trimmed) {
          addTask(column.id, trimmed);
        }
        setTempCardContent('');
        setIsAddingCard(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideTempCard);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideTempCard);
    };
  }, [isAddingCard, tempCardContent]);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 w-80 min-h-[500px] shadow-md border border-zinc-200 dark:border-zinc-800 flex-shrink-0 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="w-full">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              className="text-xl font-semibold text-gray-800 dark:text-white w-full border border-zinc-400 p-1 rounded-xl outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                else if (e.key === 'Escape') {
                  setIsEditingTitle(false);
                  setTitle(column.title);
                }
              }}
              autoFocus
            />
          ) : (
            <h3
              className="text-xl font-semibold text-zinc-800 dark:text-white"
              onDoubleClick={() => setIsEditingTitle(true)}
            >
              {column.title}
            </h3>
          )}
        </div>

        <button
          onMouseDown={() => {
            justClickedMenu.current = true;
            setTimeout(() => {
              justClickedMenu.current = false;
            }, 0);
          }}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="p-1 text-zinc-500 hover:text-zinc-800 cursor-pointer"
          aria-label="Open column menu"
        >
          <HiDotsVertical />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-2 top-10 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow flex flex-col gap-1 px-4 py-4 z-10"
          >
            <button
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 text-left flex items-center gap-1 cursor-pointer"
              onClick={() => {
                setIsEditingTitle(true);
                setMenuOpen(false);
              }}
            >
              <HiPencilSquare />
              Edit
            </button>
            <button
              className="text-sm text-red-500 dark:text-red-400 hover:text-red-500 text-left flex items-center gap-1 cursor-pointer"
              onClick={() => {
                deleteColumn(column.id);
                setMenuOpen(false);
              }}
            >
              <HiTrash />
              Delete
            </button>
          </div>
        )}
      </div>

      <Droppable droppableId={column.id} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-2 rounded-xl min-h-[400px] ${
              snapshot.isDraggingOver ? 'bg-zinc-400' : 'bg-zinc-100 dark:bg-zinc-800'
            }`}
          >
            {tasks.map((task, index) => (
              <Card
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                editTask={editTask}
                deleteTask={deleteTask}
              />
            ))}

            {isAddingCard && (
              <div className="bg-white dark:bg-zinc-600 p-4 rounded-lg shadow mb-3 text-sm text-gray-800">
                <input
                  ref={tempInputRef}
                  className="w-full text-sm border border-zinc-400 p-1 rounded outline-none"
                  value={tempCardContent}
                  onChange={(e) => setTempCardContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const trimmed = tempCardContent.trim();
                      if (trimmed) {
                        addTask(column.id, trimmed);
                      }
                      setTempCardContent('');
                      setIsAddingCard(false);
                    } else if (e.key === 'Escape') {
                      setTempCardContent('');
                      setIsAddingCard(false);
                    }
                  }}
                  autoFocus
                />
              </div>
            )}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {!isAddingCard && (
        <button
          className="mt-4 px-2 py-2 w-full bg-zinc-700 text-white text-sm rounded flex items-center gap-1 cursor-pointer"
          onClick={() => {
            setIsAddingCard(true);
            setTempCardContent('');
          }}
          aria-label="Add new card"
        >
          <HiOutlinePlusCircle className="w-6 h-6" />
          Add Card
        </button>
      )}
    </div>
  );
}
