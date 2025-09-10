"use client";

import { useState, Fragment } from "react";

import UnderlineLink from "./UnderlineLink";

type HoursData = {
  quarter: "AUTUMN" | "WINTER" | "SPRING" | "SUMMER";
  dateRange: string;
  hours: { label: string; open?: string; close?: string; closed?: true }[];
  message: string | null;
};

const CURRENT_QUARTER = "AUTUMN";
const HOURS: HoursData[] = [
  {
    quarter: "AUTUMN",
    dateRange: "September 29 \u{2013} December 13, 2025",
    hours: [
      { label: "Weekdays", open: "10:00 AM", close: "10:00 PM" },
      { label: "Weekends", open: "12:00 PM", close: "10:00 PM" },
    ],
    message:
      "CSIL is closed on October 13th in observance of Indigenous Peoples' Day",
  },
  {
    quarter: "WINTER",
    dateRange: "January 5 \u{2013} March 14, 2026",
    hours: [
      { label: "Weekdays", open: "10:00 AM", close: "10:00 PM" },
      { label: "Weekends", open: "12:00 PM", close: "10:00 PM" },
    ],
    message: null,
  },
  {
    quarter: "SPRING",
    dateRange: "March 23 \u{2013} May 29, 2026",
    hours: [
      { label: "Weekdays", open: "10:00 AM", close: "10:00 PM" },
      { label: "Weekends", open: "12:00 PM", close: "10:00 PM" },
    ],
    message: null,
  },
  {
    quarter: "SUMMER",
    dateRange: "June 15 \u{2013} August 22, 2026",
    hours: [
      { label: "Weekdays", open: "10:00 AM", close: "4:00 PM" },
      { label: "Weekends", closed: true },
    ],
    message: null,
  },
];

const CARDS = [
  {
    title: "Lab Reservations",
    content: (
      <>
        Our five labs are located on the first floor of Crerar. Each lab holds
        up to 20 students and comes with current hardware and software for macOS
        and Ubuntu Linux, along with audio/video equipment. You can view our{" "}
        <UnderlineLink href="/schedule" text="lab schedule" /> and{" "}
        <UnderlineLink href="/contact" text="contact us" /> to reserve a lab.
      </>
    ),
  },
  {
    title: "Minicourses",
    content: (
      <>
        We offer free minicourse sessions each quarter, taught by UChicago
        students. Learn about systems, software, and more in a relaxed
        environment. Reservation is not required. Check out our{" "}
        <UnderlineLink href="/minicourses" text="minicourses page" /> for more.
      </>
    ),
  },
  {
    title: "User Support",
    content: (
      <>
        CSIL has current hardware and software for macOS and Ubuntu Linux, along
        with hardware, scanners, and video projection equipment in the labs.
        Check out our list of our resources on our{" "}
        <UnderlineLink href="/software" text="software page " />.
      </>
    ),
  },
  {
    title: "Borrow Resources",
    content: (
      <>
        From chargers to headphones to adapters to mice, and more, CSIL offers a
        wide variety of <UnderlineLink href="/hardware" text="equipment" /> that
        you can check out for free. Visit the CSIL tutor desk during oppening
        hours to check out a resource.
      </>
    ),
  },
];

const HoursSection: React.FC<{
  data: HoursData;
  visible: boolean;
}> = ({ data, visible }) => {
  const { quarter, dateRange, hours, message } = data;
  const style = visible ? "opacity-100" : "pointer-events-none opacity-0";
  return (
    <section
      key={quarter}
      className={`col-start-1 row-start-1 transition-opacity ${style}`}
    >
      <div className="hidden pt-4 text-2xl text-neutral-600 sm:block">
        {dateRange}
      </div>
      <div className="inline-grid grid-cols-[auto_auto_auto_auto] gap-x-3 pt-6 text-xl sm:pt-4">
        {hours.map(({ label, open, close, closed }, index) => {
          if (closed) {
            return (
              <Fragment key={index}>
                <div className="text-left font-normal">{label}:</div>
                <div>Closed</div>
              </Fragment>
            );
          } else {
            return (
              <Fragment key={index}>
                <div className="text-left font-normal">{label}:</div>
                <div>{open}</div>
                <div>&ndash;</div>
                <div>{close}</div>
              </Fragment>
            );
          }
        })}
      </div>
      {message === null ? undefined : (
        <div className="pt-4 text-lg leading-tight text-neutral-600">
          {message}
        </div>
      )}
    </section>
  );
};

const LabHours: React.FC = () => {
  const [activeQuarter, setActiveQuarter] = useState(CURRENT_QUARTER);
  const currentData = HOURS.find(({ quarter }) => quarter === CURRENT_QUARTER)!;

  return (
    <div className="w-full max-w-[1152px] border-neutral-200 px-6 py-8 sm:border-x sm:px-10">
      <div className="flex justify-between">
        <div className="block text-3xl font-normal">Lab Hours</div>
        <div className="my-auto text-sm font-normal">
          <div className="hidden gap-x-2 md:flex">
            {HOURS.map(({ quarter }) => {
              const style =
                quarter === activeQuarter
                  ? "bg-black text-white"
                  : "bg-white text-black hover:text-neutral-600";
              return (
                <button
                  className={`cursor-pointer rounded-full border border-black px-3 py-0.5 transition-colors ${style}`}
                  key={quarter}
                  onClick={() => setActiveQuarter(quarter)}
                >
                  {quarter}
                </button>
              );
            })}
          </div>
          <div className="flex rounded-full border border-black bg-black px-3 py-0.5 text-white md:hidden">
            {CURRENT_QUARTER}
          </div>
        </div>
      </div>
      <div className="relative hidden md:grid">
        {HOURS.map((data, index) => (
          <HoursSection
            key={index}
            data={data}
            visible={data.quarter == activeQuarter}
          />
        ))}
      </div>
      <div className="md:hidden">
        <HoursSection data={currentData} visible={true} />
      </div>
    </div>
  );
};

const Cards: React.FC = () => {
  return (
    <div className="w-full max-w-[1152px] border-neutral-200 sm:border-x">
      <div className="grid grid-cols-1 divide-y divide-neutral-200 border-y border-neutral-200 sm:grid-cols-2 sm:divide-x-0 sm:divide-y-0 sm:[&>*]:border-neutral-200 sm:[&>*:nth-child(2n)]:border-l sm:[&>*:nth-child(n+3)]:border-t">
        {CARDS.map(({ title, content }, index) => (
          <section className="relative" key={index}>
            <div className="absolute top-0 left-0 flex size-10 items-center justify-center border-r border-b border-neutral-200 text-center font-mono font-light text-neutral-600">
              {(index + 1).toString().padStart(2, "0")}
            </div>
            <div className="p-10">
              <h3 className="pt-1 text-xl font-normal">{title}</h3>
              <p className="pt-2 text-lg leading-tight">{content}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center sm:px-12">
      <LabHours />
      <Cards />
      <div className="min-h-64 w-full max-w-[1152px] border-x border-neutral-200"></div>
    </div>
  );
};

export default Home;
