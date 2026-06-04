import { useLocation } from "react-router-dom";

import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {

  const location = useLocation();

  // Reels Page Check
  const isReelsPage =
    location.pathname === "/reels";

  return (

    <>

      {/* Desktop Navbar */}
      <DesktopNavbar />

      {/* Mobile Navbar Hide On Reels */}
      {
        !isReelsPage && (
          <MobileNavbar />
        )
      }

    </>

  );

};

export default Navbar;