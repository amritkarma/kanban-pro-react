import type { KanbanData } from '../types/types';

export const initialData: KanbanData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Create a new project in Figma' },
    'task-2': { id: 'task-2', content: 'Set up the Vite & Tailwind project' },
    'task-3': { id: 'task-3', content: 'Develop the Kanban board components' },
    'task-4': { id: 'task-4', content: 'Write the project documentation' },
    'task-5': { id: 'task-5', content: 'Design responsive UI layouts' },
    'task-6': { id: 'task-6', content: 'Implement dark mode toggle' },
    'task-7': { id: 'task-7', content: 'Integrate API endpoints' },
    'task-8': { id: 'task-8', content: 'Write unit tests for components' },
    'task-9': { id: 'task-9', content: 'Fix accessibility issues' },
    'task-10': { id: 'task-10', content: 'Deploy the app to Vercel' },
    'task-11': { id: 'task-11', content: 'Refactor state management logic' },
    'task-12': { id: 'task-12', content: 'Optimize images and assets' },
    'task-13': { id: 'task-13', content: 'Create a 404 error page' },
    'task-14': { id: 'task-14', content: 'Conduct usability testing' },
    'task-15': { id: 'task-15', content: 'Implement drag-and-drop features' },
    'task-16': { id: 'task-16', content: 'Set up CI/CD with GitHub Actions' },
    'task-17': { id: 'task-17', content: 'Add animations with Framer Motion' },
    'task-18': { id: 'task-18', content: 'Create reusable form components' },
    'task-19': { id: 'task-19', content: 'Write E2E tests with Playwright' },
    'task-20': { id: 'task-20', content: 'Review PRs from contributors' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: [
        'task-1', 'task-2', 'task-5', 'task-7', 'task-10',
        'task-11', 'task-12', 'task-13',
      ],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [
        'task-3', 'task-6', 'task-9',
        'task-15', 'task-16', 'task-18',
      ],
    },
    'column-3': {
      id: 'column-3',
      title: 'Review',
      taskIds: ['task-8', 'task-14', 'task-17', 'task-19'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Done',
      taskIds: ['task-4', 'task-20'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};
