import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default App;
