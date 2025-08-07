import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { GiHamburgerMenu } from "react-icons/gi";
import { data } from "../restApi.json";
import { useNavigate } from "react-router-dom";  
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    // Check login status and user name from localStorage on component mount
    if (localStorage.getItem("isLoggedIn") === "true") {
      setLoggedIn(true);
      setUserName(localStorage.getItem("userName") || "");
    } else {
      setLoggedIn(false);
      setUserName("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    setLoggedIn(false);
    setUserName("");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <>
      <nav>
        <div className="logo">Pichuka Restaurant</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {data[0].navbarLinks.map((element) => {
              // Handle HOME navigation differently - redirect to home page
              if (element.title === 'HOME') {
                return (
                  <span
                    key={element.id}
                    style={{ cursor: 'pointer', fontSize: '17px', fontWeight: 300, letterSpacing: '1.4px', color: '#555' }}
                    onClick={() => navigate('/')}
                  >
                    {element.title}
                  </span>
                );
              }
              // Keep smooth scrolling for other navigation items
              return (
                <Link
                  to={element.link}
                  spy={true}
                  smooth={true}
                  duration={500}
                  key={element.id}
                >
                  {element.title}
                </Link>
              );
            })}
          {loggedIn && (
            <>
              {localStorage.getItem("userRole") === "Employee" ? (
                // Chef-specific navigation
                <>
                  <span
                    className="orders-link"
                    style={{ cursor: 'pointer', marginLeft: '25px', fontSize: '17px', fontWeight: 300, letterSpacing: '1.4px', color: '#555' }}
                    onClick={() => navigate('/chef-dashboard')}
                  >
                    DASHBOARD
                  </span>
                  <span
                    className="orders-link"
                    style={{ cursor: 'pointer', marginLeft: '25px', fontSize: '17px', fontWeight: 300, letterSpacing: '1.4px', color: '#555' }}
                    onClick={() => navigate('/chef/kitchen-queue')}
                  >
                    KITCHEN QUEUE
                  </span>
                </>
              ) : (
                // Customer navigation - add customer-specific options
                <>
                  <span
                    className="orders-link"
                    style={{ cursor: 'pointer', marginLeft: '25px', fontSize: '17px', fontWeight: 300, letterSpacing: '1.4px', color: '#555' }}
                    onClick={() => navigate('/orders')}
                  >
                    ORDERS
                  </span>
                  <span
                    className="orders-link"
                    style={{ cursor: 'pointer', marginLeft: '25px', fontSize: '17px', fontWeight: 300, letterSpacing: '1.4px', color: '#555' }}
                    onClick={() => navigate('/cart')}
                  >
                    CART
                  </span>
                  <span
                    className="orders-link"
                    style={{ cursor: 'pointer', marginLeft: '25px', fontSize: '17px', fontWeight: 300, letterSpacing: '1.4px', color: '#555' }}
                    onClick={() => navigate('/order-history')}
                  >
                    ORDER HISTORY
                  </span>
                  <span
                    className="orders-link"
                    style={{ cursor: 'pointer', marginLeft: '25px', fontSize: '17px', fontWeight: 300, letterSpacing: '1.4px', color: '#555' }}
                    onClick={() => navigate('/track-order')}
                  >
                    TRACK ORDER
                  </span>
                </>
              )}
            </>
          )}
          </div>
          {loggedIn ? (
            <div className="loggedInUserContainer">
              <span className="userNameDisplay">Welcome, {userName}!</span>
              <button 
                className="menuBtn"
                onClick={handleLogout} 
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              className="menuBtn"
              onClick={() => navigate('/login')} 
            >
              Login/Signup
            </button>
          )}
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
