import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-main-bg text-white font-cairo">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
