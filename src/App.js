import { Routes, Route } from "react-router-dom";
import "./index.css"; // Tailwind CSS or other styles
import Home from "./components/home";
import AdminDashboard from "./components/SheetView";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <><ToastContainer /><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminDashboard />} />
      {/* You can add more routes here */}
    </Routes></>
  );
}

export default App;
