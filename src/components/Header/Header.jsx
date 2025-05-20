import React from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);

  const navItems = [
    { name: "Home",     to: "/",            show: true },
    { name: "Login",    to: "/login",       show: !authStatus },
    { name: "Signup",   to: "/signup",      show: !authStatus },
    { name: "All Posts",to: "/all-posts",   show: authStatus },
    { name: "Add Post", to: "/add-post",    show: authStatus },
  ].filter(item => item.show);

  return (
    <header className="fixed z-30 w-full py-3 shadow bg-deep-orange">
      <Container>
        <nav className="flex items-center">
          <NavLink to="/" className="mr-4">
            <Logo width="80px" />
          </NavLink>

          <ul className="flex ml-auto space-x-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `inline-block px-6 py-2 rounded-full transition ${
                      isActive
                        ? "bg-bright-yellow text-black font-semibold"
                        : "text-white hover:bg-bright-yellow hover:text-black"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
