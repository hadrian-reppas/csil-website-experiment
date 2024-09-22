import logo from "../../pubilc/logo.svg";

const NavBar: React.FC<{}> = ({}) => {
  return (
    <header className="flex h-14 w-full flex-row border-b border-black text-[22px] font-light">
      <button className="w-14 p-3">
        <img className="h-8 w-8" src={logo.src} alt="CSIL logo" />
      </button>
      <div className="flex flex-row">
        <button className="flex items-center px-4 transition-opacity hover:opacity-60">
          <span>General</span>
          {/* Learn about CSIL and meet our friendly staff. */}
          {/* - About Us
              - Staff
              - Policies */}
        </button>
        <button className="flex items-center px-4 transition-opacity hover:opacity-60">
          <span>Resources</span>
          {/* Explore our services: equipment, software and minicourses just for you. */}
          {/* - Available Hardware
              - Available Software
              - Minicourses */}
        </button>
        <button className="flex items-center px-4 transition-opacity hover:opacity-60">
          <span>Inquiries</span>
          {/* Check out our events, plan a visit or get in touch—we're excited to meet you! */}
          {/* - Lab Schedule
              - Events
              - Location and Hours
              - Contact */}
        </button>
      </div>
    </header>
  );
};

export default NavBar;
