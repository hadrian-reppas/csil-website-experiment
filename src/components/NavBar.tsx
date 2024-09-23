import { useRef, useEffect, useState, RefObject, createRef } from "react";
import Link from "next/link";

import logo from "../../pubilc/logo.svg";

const NAVBAR_ITEMS: Item[] = [
  {
    name: "General",
    index: 0,
    text: "Learn about CSIL and meet our friendly tutors.",
    links: [
      { label: "About", href: "/about" },
      { label: "Visit Us", href: "/visit" },
      { label: "Policies", href: "/policies" },
      { label: "Staff", href: "/staff" },
    ],
  },
  {
    name: "Resources",
    index: 1,
    text: "Explore our services: equipment, software and minicourses.",
    links: [
      { label: "Available Hardware", href: "/hardware" },
      { label: "Available Software", href: "/software" },
      { label: "Minicourses", href: "/minicourses" },
    ],
  },
  {
    name: "Inquiries",
    index: 2,
    text: "Check out our events, plan a visit or get in touch. We're excited to meet you!",
    links: [
      { label: "Lab Schedule", href: "/schedule" },
      { label: "Events", href: "/events" },
      { label: "Location and Hours", href: "/visit" },
      { label: "Contact", href: "/Contact" },
    ],
  },
  {
    name: "Related Links",
    index: 3,
    text: "Looking for more? Check out these resources.",
    links: [
      { label: "MADD Center", href: "https://maddcenter.uchicago.edu/" },
      { label: "UChicago CS", href: "https://computerscience.uchicago.edu/" },
      {
        label: "John Crerar Library",
        href: "https://www.lib.uchicago.edu/crerar/",
      },
    ],
  },
];

interface Highlight {
  scale: number;
  translate: number;
}

interface Item {
  name: string;
  index: number;
  text: string;
  links: ItemLink[];
}

interface ItemLink {
  label: string;
  href: string;
}

interface NavBarItemProps {
  item: Item;
  isSelected: boolean;
  handleClick: (item: Item) => void;
  buttonRef: RefObject<HTMLButtonElement>;
}

interface DropdownProps {
  item: Item | null;
  isOpen: boolean;
  dropdownRef: RefObject<HTMLDivElement>;
}

const NavBarItem: React.FC<NavBarItemProps> = ({
  item,
  isSelected,
  handleClick,
  buttonRef,
}) => (
  <button
    className={
      "flex items-center px-4" +
      (isSelected ? "" : " transition-opacity hover:opacity-70")
    }
    onClick={() => handleClick(item)}
    ref={buttonRef}
  >
    <span className="text-nowrap">{item.name}</span>
  </button>
);

const Dropdown: React.FC<DropdownProps> = ({ item, isOpen, dropdownRef }) => {
  const dropdownHeight = isOpen ? "h-64" : "h-0";
  const links = item ? item.links : [];
  return (
    <div
      className={`overflow-none absolute top-full grid w-screen grid-cols-2 gap-x-4 bg-black px-6 duration-300 ${dropdownHeight}`}
      style={{ transitionProperty: "height" }}
      ref={dropdownRef}
    >
      <div className="px-4 py-8">
        <span className="font-serif text-3xl font-thin text-white">
          {item?.text}
        </span>
      </div>
      <div className="flex flex-col gap-y-2 px-4 py-8">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="block text-2xl text-white transition-opacity hover:opacity-70"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

const NavBar: React.FC<{}> = ({}) => {
  const [selected, setSelected] = useState<Item | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [highlighTransition, setHighlighTransition] =
    useState<string>("transition-opacity");
  const parentRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(
    new Array(NAVBAR_ITEMS.length)
      .fill(null)
      .map(() => createRef<HTMLButtonElement>()),
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = (item: Item) => {
    if (item.index === selectedIndex) {
      setSelectedIndex(null);
      setHighlighTransition("transition-opacity");
    } else {
      setSelected(item);
      setSelectedIndex(item.index);
      const parent = parentRef.current!.getBoundingClientRect();
      const element =
        buttonRefs.current[item.index]!.current!.getBoundingClientRect();
      const scale = element.width / parent.width;
      setHighlight({
        scale,
        translate: (element.left - parent.left) / scale,
      });
      setHighlighTransition(
        selectedIndex === null ? "transition-opacity" : "transition-transform",
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        parentRef.current &&
        !parentRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [parentRef]);

  const highlightOpacity = selectedIndex === null ? "opacity-0" : "opacity-100";

  return (
    <header className="relative sticky top-0 flex h-14 w-full flex-row border-b border-black bg-white text-[22px] font-light">
      <button className="w-14 shrink-0 p-3">
        <img className="h-8 w-8" src={logo.src} alt="CSIL logo" />
      </button>
      <div className="relative flex flex-row" ref={parentRef}>
        {NAVBAR_ITEMS.map((item, index) => (
          <NavBarItem
            item={item}
            isSelected={item.index === selectedIndex}
            handleClick={handleClick}
            buttonRef={buttonRefs.current[index]!}
            key={index}
          />
        ))}
        <div
          className={`pointer-events-none absolute left-0 right-0 h-full origin-left bg-white mix-blend-difference ${highlightOpacity} ${highlighTransition} duration-300`}
          style={{
            transform: highlight
              ? `scale(${highlight.scale}, 1) translate(${highlight.translate}px, 0)`
              : undefined,
          }}
        ></div>
      </div>
      <Dropdown
        item={selected}
        isOpen={selectedIndex !== null}
        dropdownRef={dropdownRef}
      />
    </header>
  );
};

export default NavBar;
