import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import TextEditor from "./components/TextEditor";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={`/document/${uuidv4()}`} />,
  },
  {
    path: "/document/:id",
    element: <TextEditor />,
  },
]);
function App() {
  return (
    <div className="App">
      <TextEditor />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
