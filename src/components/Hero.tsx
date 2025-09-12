"use client";

import HeroPentagons from "./HeroPentagons";
import BigButton from "./BigButton";

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
            <BigButton label="Learn More" href="/about" />
            <BigButton label="Make a Reservation" href="/reservations" />
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
