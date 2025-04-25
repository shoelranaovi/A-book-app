/* eslint-disable react/no-unescaped-entities */
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { FaRegMoon } from "react-icons/fa6";
import { IoMdSunny } from "react-icons/io";
import logo from "../assets/book-and-pen-svgrepo-com.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/themeSlice";
import { summaryApi } from "../common";
import { toast } from "react-toastify";
import { SigninSuccess } from "../redux/userSlice";

export function NavbarMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const { pathname } = useLocation();

  // Array of navigation links
  const navLinks = [
    {
      path: "/Createpost",
      label: "Create Post",
      type: "link",
      useLinkComponent: true,
    },
    { path: "/home", label: "Home", type: "button" },
    { path: "/About", label: "About us", type: "button" },
    { path: "/Books", label: "All Book", type: "link", useLinkComponent: true },
  ];

  // Signout handler
  async function signout() {
    try {
      const response = await fetch(summaryApi.signout.url, {
        method: summaryApi.signout.method,
        credentials: "include",
      });
      const data = await response.json();
      toast.success(data.message || "Signed out successfully!");
      navigate("/home");
      dispatch(SigninSuccess(null));
    } catch (error) {
      toast.error(error.message || "Failed to sign out.");
    }
  }

  return (
    <Navbar className="rounded w-full fixed z-30">
      <NavbarBrand>
        <img src={logo} className="w-10" alt="Logo" />
        <h1 className="text-2xl font-bold">Ovi's Book</h1>
      </NavbarBrand>

      <div className="flex gap-2 md:order-2 dark:text-gray-950">
        {/* Theme Toggle Button */}
        <Button
          outline
          pill
          onClick={() => dispatch(setTheme())}
          className="outline-none">
          {theme === "dark" ? <IoMdSunny size={20} /> : <FaRegMoon size={20} />}
        </Button>

        {currentUser ? (
          <div className="flex gap-3">
            <Link to="/Dashboard?tab=profile">
              <Button outline>Profile</Button>
            </Link>
            <Button onClick={signout} gradientDuoTone="purpleToPink">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              outline
              gradientDuoTone="purpleToBlue"
              onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button
              gradientDuoTone="purpleToPink"
              onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        {navLinks.map((link, index) => {
          // If the link should be rendered as a react-router Link component:
          if (link.useLinkComponent) {
            return (
              <Link key={index} to={link.path}>
                <NavbarLink active={pathname === link.path} as="div">
                  {link.label}
                </NavbarLink>
              </Link>
            );
          }

          // Else, render as a clickable element that uses navigate on click.
          return (
            <NavbarLink
              key={index}
              as="div"
              onClick={() => navigate(link.path)}
              active={pathname === link.path}>
              {link.label}
            </NavbarLink>
          );
        })}
      </NavbarCollapse>
    </Navbar>
  );
}

export default NavbarMenu;
