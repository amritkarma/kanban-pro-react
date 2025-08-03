import { Draggable } from '@hello-pangea/dnd';
import type { Task } from '../types/types';
import { HiDotsVertical } from 'react-icons/hi';
import { useState, useEffect, useRef } from 'react';
import { HiPencilSquare, HiTrash } from 'react-icons/hi2';

interface CardProps {
  task: Task;
  index: number;
  columnId: string;
  editTask: (taskId: string, newContent: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
}

export function Card({
  task,
  index,
  columnId,
  editTask,
  deleteTask,
}: CardProps) {
  const [cardMenuOpen, setCardMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const justClickedMenu = useRef(false);

  const handleSave = () => {
    const trimmed = editContent.trim();
    if (trimmed && trimmed !== task.content) {
      editTask(task.id, trimmed);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        handleSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, editContent]);

  useEffect(() => {
    if (!cardMenuOpen) return;

    const handleMenuClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (justClickedMenu.current) {
          justClickedMenu.current = false;
          return;
        }
        setCardMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMenuClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleMenuClickOutside);
      justClickedMenu.current = false;
    };
  }, [cardMenuOpen]);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative bg-white dark:bg-zinc-600 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white p-4 rounded-xl flex items-center justify-between shadow mb-3 text-sm hover:shadow-lg cursor-pointer"
        >
          <div className="w-full">
            {isEditing ? (
              <input
                ref={inputRef}
                className="w-full text-sm border border-zinc-400 p-1 rounded outline-none"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  else if (e.key === 'Escape') {
                    setIsEditing(false);
                    setEditContent(task.content);
                  }
                }}
                autoFocus
              />
            ) : (
              <div className='font-medium'
                onDoubleClick={() => {
                  setIsEditing(true);
                  setEditContent(task.content);
                  setCardMenuOpen(false);
                }}
              >
                {task.content}
              </div>
            )}
          </div>

          <button
            title="card menu"
            type="button"
            onMouseDown={() => {
              justClickedMenu.current = true;
              setTimeout(() => {
                justClickedMenu.current = false;
              }, 0);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setCardMenuOpen((prev) => !prev);
            }}
            className="px-2 py-2 cursor-pointer"
          >
            <HiDotsVertical />
          </button>

          {cardMenuOpen && (
            <div
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 -right-16 px-4 py-4 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 drop-shadow-2xl rounded-xl z-10 flex flex-col gap-1 cursor-default"
            >
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditContent(task.content);
                  setCardMenuOpen(false);
                }}
                className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-500 text-left flex items-center gap-1 cursor-pointer"
              >
                <HiPencilSquare />
                Edit
              </button>
              <button
                onClick={() => {
                  deleteTask(columnId, task.id);
                  setCardMenuOpen(false);
                }}
                className="text-red-500 dark:text-red-400 text-sm hover:text-red-500 text-left flex items-center gap-1 cursor-pointer"
              >
                <HiTrash />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
