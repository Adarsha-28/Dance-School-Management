import AppRoutes from './Routers/AppRoutes';
import {BrowserRouter} from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
