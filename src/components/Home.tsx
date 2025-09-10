"use client";

import { useState, Fragment } from "react";

type HoursData = {
  quarter: "AUTUMN" | "WINTER" | "SPRING" | "SUMMER";
  dateRange: string;
  hours: { label: string; open: string | null; close: string | null }[];
  message: string | null;
};

const QUARTERS = ["AUTUMN", "WINTER", "SPRING", "SUMMER"];
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
      { label: "Weekends", open: null, close: null },
    ],
    message: null,
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
        {hours.map(({ label, open, close }, index) => {
          if (open !== null && close !== null) {
            return (
              <Fragment key={index}>
                <div className="text-left font-normal">{label}:</div>
                <div>{open}</div>
                <div>&ndash;</div>
                <div>{close}</div>
              </Fragment>
            );
          } else {
            return (
              <Fragment key={index}>
                <div className="text-left font-normal">{label}:</div>
                <div>Closed</div>
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
    <div className="w-full max-w-[1152px] border-x border-neutral-200 px-6 py-8 sm:px-10">
      <div className="flex justify-between">
        <div className="block text-3xl font-normal">Lab Hours</div>
        <div className="my-auto text-sm font-normal">
          <div className="hidden gap-x-2 md:flex">
            {QUARTERS.map((quarter) => {
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

const Home: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center divide-y sm:border-neutral-200 sm:px-12">
      <LabHours />
      <div className="min-h-64 w-full max-w-[1152px] border-x border-neutral-200"></div>
      <div className="min-h-64 w-full max-w-[1152px] border-x border-neutral-200"></div>
    </div>
  );
};

export default Home;
