import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AuthenticationRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user);

  // If there is no current user, redirect to login page.
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If the current user is not an admin, redirect to home page.
  if (currentUser.role !== "Admin") {
    return <Navigate to="/home" replace />;
  }

  // If the user is authenticated and has the "Admin" role, render the child components.
  return children;
}

export default AuthenticationRoute;

