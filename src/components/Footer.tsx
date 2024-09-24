// eslint disable @typescript-eslint/no-unsafe-assignment
// eslint disable @typescript-eslint/no-unsafe-member-access


import { useRef, useState } from "react";

import facebook from "../../pubilc/social_logos/facebook.svg";
import instagram from "../../pubilc/social_logos/instagram.svg";
import x from "../../pubilc/social_logos/x.svg";

const Footer: React.FC = () => {
  const csilCsilCsilRef = useRef<HTMLDivElement>(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!csilCsilCsilRef.current) return;
    const rect = csilCsilCsilRef.current.getBoundingClientRect();
    setMouseCoords({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <footer
      className="group/footer relative w-full overflow-visible bg-black text-gray-700"
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute h-full w-full select-none overflow-hidden text-[10px] font-light leading-tight opacity-0 transition-opacity duration-300 group-hover/footer:opacity-100"
        style={{
          maskImage: `radial-gradient(200px at ${mouseCoords.x}px ${mouseCoords.y}px, white, transparent)`,
        }}
        ref={csilCsilCsilRef}
      >
        {Array.from({ length: 20 }, (_, index) => (
          <div
            key={index}
            className="mb-[4px] mt-[-5px] w-full overflow-visible text-nowrap"
            style={{ marginLeft: `${-6 * (index + 1)}px` }}
          >
            {"CSIL ".repeat(200)}
          </div>
        ))}
      </div>
      <div className="relative grid w-full grid-cols-1 gap-y-4 p-4 text-lg sm:grid-cols-3 sm:p-8 sm:text-xl">
        <div className="leading-tight text-white sm:col-span-2">
          Computer Science Instructional Lab (CSIL)
          <br />
          The University of Chicago
          <br />
          5730 S Ellis Ave
          <br />
          Chicago, IL 60637
        </div>
        <div className="flex flex-col">
          <a className="text-white" href="tel:773-702-1082">
            (773) 702-1082
          </a>
          <a className="text-white" href="mailto:csil@cs.uchicago.edu">
            csil@cs.uchicago.edu
          </a>
          <div className="mt-2 flex flex-row gap-x-1">
            <a
              className="w-10 h-10 p-2"
              href="https://www.facebook.com/uchicagocsil/"
            >
              <img src={facebook.src} className="h-6 w-6"></img>
            </a>
            <a
              className="w-10 h-10 p-2"
              href="https://www.instagram.com/uchicagocsil/"
            >
              <img src={instagram.src} className="h-6 w-6"></img>
            </a>
            <a
              className="w-10 h-10 p-2"
              href="https://twitter.com/UChicagoCSIL"
            >
              <img src={x.src} className="h-6 w-6"></img>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
