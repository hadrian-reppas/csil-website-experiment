import Link from "next/link";
import Image, { type StaticImageData } from "next/image";

import rightArrow from "~/../public/right-arrow.svg";

const BigButton: React.FC<{
  label: string;
  href: string;
}> = ({ label, href }) => {
  return (
    <Link
      className="group relative flex h-12 w-72 items-center justify-between border border-black bg-white sm:h-14 sm:w-96"
      href={href}
    >
      <span className="ml-4 text-xl text-nowrap sm:text-[22px]">{label}</span>
      <Image
        className="mr-4 transition-transform duration-300 ease-in-out will-change-transform group-hover:translate-x-1.5 motion-reduce:transition-none sm:mr-6"
        src={(rightArrow as StaticImageData).src}
        width={28}
        height={28}
        alt="right arrow"
      />
      <div className="absolute inset-0 bg-white opacity-0 mix-blend-difference duration-150 hover:opacity-100"></div>
    </Link>
  );
};

export default BigButton;
