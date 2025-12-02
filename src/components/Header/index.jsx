import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useState } from "react";
import ToastNotification from "../modals/Toast";

// Navigation items configuration
const NAV_ITEMS = [
  { label: "Notes", path: "/notes" },
  { label: "PYQ", path: "/pyq" },
  { label: "Grade Calculator", path: "/grade-calculator" },
  { label: "Model Question Paper", path: "/model-question-paper" },
  { label: "Attendance Calculator", path: "/attendance-calculator" },
  { label: "About", path: "/about" },
];

// Color theme configuration
const THEME = {
  primary: "#6d28d9",
  white: "#ffffff",
  black: "#000000",
  background: "bg-zinc-800",
  border: "border-gray-600",
};

export default function Header() {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleLogout = () => {
    clearUser();
    setToastMessage("Logout successful!");
    setToastOpen(true);
  };

  const brandStyle = {
    fontFamily: "sans-serif",
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: THEME.white,
    letterSpacing: "0.15rem",
    transition: "color 0.3s ease",
    textDecoration: "none",
  };

  const buttonStyle = {
    backgroundColor: THEME.primary,
    color: THEME.white,
    border: "none",
    transition: "all 0.3s ease",
    borderRadius: "6px",
    fontWeight: "500",
  };

  const handleBrandHover = (e, isHover) => {
    e.target.style.color = isHover ? THEME.primary : THEME.white;
  };

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.backgroundColor = THEME.white;
      e.target.style.color = THEME.black;
    } else {
      e.target.style.backgroundColor = THEME.primary;
      e.target.style.color = THEME.white;
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        className={`${THEME.background} border-b-2 ${THEME.border} py-2`}
        variant="dark"
      >
        <Container className="mx-auto">
          {/* Brand */}
          <Navbar.Brand
            as={Link}
            to="/"
            style={brandStyle}
            onMouseEnter={(e) => handleBrandHover(e, true)}
            onMouseLeave={(e) => handleBrandHover(e, false)}
          >
            EduBuddy
          </Navbar.Brand>

          {/* Mobile Toggle */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="border-white"
            style={{ borderColor: THEME.white }}
          >
            <span className="navbar-toggler-icon">
              <i
                className="fas fa-bars"
                style={{ color: THEME.white, fontSize: "1.5rem" }}
              />
            </span>
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav" className="pl-4 sm:pl-4">
            {/* Navigation Links */}
            <Nav className="mx-auto space-y-2 lg:space-y-0 lg:gap-6 md:gap-4 sm:gap-2">
              {NAV_ITEMS.map((item) => (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  className="text-white transition-all font-medium text-xl relative group py-2 mb-2"
                  style={{
                    "--hover-color": THEME.primary,
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.label}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-[0.15em] bg-purple-500 transition-all group-hover:w-full"
                    style={{
                      backgroundColor: THEME.primary,
                      transition: "width 0.3s ease, height 0.3s ease",
                    }}
                  />
                </Nav.Link>
              ))}
            </Nav>

            {/* Auth Button */}
            {user ? (
              <Button
                className="btn px-3 py-1"
                style={buttonStyle}
                onClick={handleLogout}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
              >
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  className="btn px-3 py-1"
                  style={buttonStyle}
                  onMouseEnter={(e) => handleButtonHover(e, true)}
                  onMouseLeave={(e) => handleButtonHover(e, false)}
                >
                  Login
                </Button>
              </Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Toast Notification */}
      <ToastNotification
        open={toastOpen}
        setOpen={setToastOpen}
        message={toastMessage}
      />
    </>
  );
}
