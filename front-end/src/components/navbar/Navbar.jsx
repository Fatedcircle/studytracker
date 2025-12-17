import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { Link, NavLink } from "react-router";
import './navbar.css'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useUser();

    return (
        <nav className="main-nav">
            <h2><NavLink className={"logo"} to="/">📚 Study tracker</NavLink></h2>

            <button
                className={`hamburger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation"
            >
                <span></span><span></span><span></span>
            </button>

            <menu className={`nav-menu ${menuOpen ? "open" : ""}`}>
                <li><NavLink data-testid="nav-home" to="/">Home</NavLink></li>
                <li><NavLink data-testid="nav-new-course" to="/new-course">New Course</NavLink></li>
                <li><NavLink data-testid="nav-new-provider" to="/new-provider">New Provider</NavLink></li>

                {!user && (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}

                {user && (
                    <>
                        <li style={{ fontStyle: "italic" }}>
                            Logged in as: <strong>{user.name}</strong>
                        </li>

                        <li><NavLink to="/profile">My Profile</NavLink></li>

                        <li
                            style={{ cursor: "pointer", color: "tomato", fontWeight: "bold" }}
                            onClick={() => {
                                logout();
                                setMenuOpen(false);
                            }}
                        >
                            Log out
                        </li>
                    </>
                )}
            </menu>
        </nav>
    );
};

export default Navbar;
