import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import TasksPage from '@/pages/TasksPage';
import ShopPage from '@/pages/ShopPage';
import WardrobePage from '@/pages/WardrobePage';
import { GameProvider } from '@/hooks/useGame';

export default function App() {
  return (
    <GameProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/wardrobe" element={<WardrobePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </GameProvider>
  );
}
