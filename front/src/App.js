import {BrowserRouter,Routes,Route,Navigate,} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"  element={<Navigate to="/chat" replace />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={ <ProtectedRoute> <Chat /></ProtectedRoute> }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;