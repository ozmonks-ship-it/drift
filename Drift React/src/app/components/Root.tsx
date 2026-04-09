import { Outlet } from 'react-router';
import { TaskProvider } from '../context/TaskContext';

export function Root() {
  return (
    <TaskProvider>
      <div
        className="dark min-h-screen flex justify-center"
        style={{ background: '#0c0c0c', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <div className="w-full max-w-[420px] min-h-screen relative">
          <Outlet />
        </div>
      </div>
    </TaskProvider>
  );
}
