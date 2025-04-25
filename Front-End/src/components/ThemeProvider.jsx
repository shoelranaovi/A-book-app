import { useSelector } from "react-redux";

function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div
      className={`min-h-screen ${theme} bg-gray-100 text-gray-700 dark:bg-[rgb(16,23,42)] dark:text-gray-200`}>
      {children}
    </div>
  );
}

export default ThemeProvider;
