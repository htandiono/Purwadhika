import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link className="brand" to="/">
          Blog App
        </Link>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/posts/new">Create Post</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <span className="nav-user">{currentUser?.name}</span>
              <button className="button secondary small" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
