const Content: React.FC = () => {
  return (
    <div className="grid w-full grid-cols-10">
      {Array.from({ length: 200 }, (_, i) => {
        const borderR = i % 10 === 9 ? "" : "border-r";
        const borderB = i < 190 ? "border-b" : "";
        return (
          <div key={i} className={`aspect-square ${borderB} ${borderR}`}></div>
        );
      })}
    </div>
  );
};

export default Content;
