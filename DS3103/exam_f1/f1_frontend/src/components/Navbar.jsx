import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="flex justify-between items-center h-24 mx-auto px-4 text-white">
      <h1 className="w-full text-3xl font-bold text-[#e10600]">Formula One</h1>

      <div className="hidden lg:block xl:block">
        {/* Desktop menu */}
        <ul className="flex">
          <li className="p-4">
            <Link to="/home">Home</Link>
          </li>
          <li className="p-4">
            <Link to="/driver">Driver</Link>
          </li>
          <li className="p-4">
            <Link to="/team">Team</Link>
          </li>
          <li className="p-4">
            <Link to="/race">Race</Link>
          </li>
          <li className="p-4">
            <Link to="/quiz">Quiz</Link>
          </li>
        </ul>
      </div>

      <div onClick={handleNav} className="block lg:hidden xl:hidden">
        {!nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      <div
        className={
          !nav
            ? "xl:hidden lg:hidden fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "fixed left-[-100%]"
        }
      >
        {/* Mobile menu */}
        <ul className="p-4 uppercase">
          <li className="p-4 border-b border-gray-600">
            <Link to="/home">Home</Link>
          </li>
          <li className="p-4 border-b border-gray-600">
            <Link to="/driver">Driver</Link>
          </li>
          <li className="p-4 border-b border-gray-600">
            <Link to="/team">Team</Link>
          </li>
          <li className="p-4 border-b border-gray-600">
            <Link to="/race">Race</Link>
          </li>
          <li className="p-4">
            <Link to="/quiz">Quiz</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Navbar;