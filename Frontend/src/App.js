import './App.css';
import AppRoutes from './Routers/AppRoutes';
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
