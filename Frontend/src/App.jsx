import { Outlet, Link } from "react-router-dom";
import { Card } from "antd";
function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/video">Video</Link>
          </li>

          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default App;
