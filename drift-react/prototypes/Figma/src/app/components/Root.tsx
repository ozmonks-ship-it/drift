import { Outlet } from 'react-router';
import { TaskProvider } from '../context/TaskContext';
import { ThemeProvider } from '../context/ThemeContext';

export function Root() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div
          className="min-h-screen flex justify-center"
          style={{ background: 'var(--solm-bg)', fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          <div className="w-full max-w-[420px] min-h-screen relative">
            <Outlet />
          </div>
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
}
