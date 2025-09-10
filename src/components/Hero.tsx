"use client";

import Link from "next/link";
import Image, { type StaticImageData } from "next/image";

import rightArrow from "~/../public/right-arrow.svg";

import HeroPentagons from "./HeroPentagons";

const Button: React.FC<{
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

const Content: React.FC = () => {
  return (
    <div className="hero-height relative flex justify-center border-b">
      <div className="flex w-full max-w-[1152px] items-center">
        <div className="grid grid-cols-1 px-8 pt-24 pb-36 leading-none whitespace-nowrap">
          <h2 className="text-5xl leading-[0.8] font-normal sm:hidden">
            Hardware and
            <br />
            software for
            <br />
            <i>every</i> need
          </h2>
          <h2 className="hidden text-5xl leading-[0.8] font-normal sm:block">
            Hardware and software
            <br />
            for <i>every</i> need
          </h2>
          <h3 className="mt-2 mb-8 text-2xl sm:mt-3 sm:mb-12 sm:text-3xl">
            Serving UChicago for 40 years
          </h3>
          <div className="grid grid-cols-1 gap-y-2">
            <Button label="Learn More" href="/about" />
            <Button label="Make a Reservation" href="/reservations" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <div className="hero-height relative w-full overflow-hidden">
      <HeroPentagons />
      <Content />
    </div>
  );
};

export default Hero;
