import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navigationbar({
  user,
  setUser,
  showMenu,
  setShowMenu,
}) {
  const navigate = useNavigate();

  // logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };
  return (
    <div className="flex justify-between items-center mr-2">
      <div>
        <Link to="/home">
          <img
            src="/logo.png"
            alt="InsightHub blog logo"
            width={150}
            height={100}
          />
        </Link>
      </div>
      <nav>
        <ul className="flex items-center space-x-4">
          {user ? (
            <>
              <li
                className="relative cursor-pointer"
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}>
                <div className="flex items-center gap-2">
                  <img
                    src={user.image}
                    className="w-10 h-10 object-cover rounded-full shadow-sm"
                  />
                  <span className="font-medium right-8">Hi, {user.name} </span>
                </div>
                {showMenu && (
                  <div className="absolute top-full right-0  bg-white shadow rounded p-2 ">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left  p-2 text-red-600 hover:bg-gray-100 rounded cursor-pointer">
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li>
              <Link to="/" className="btn">
                Login/ Regist
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
