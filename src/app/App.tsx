import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { DevHelper } from './components/DevHelper';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <DevHelper />
    </AuthProvider>
  );
}