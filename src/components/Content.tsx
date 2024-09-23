const Content: React.FC<{}> = ({}) => {
  return (
    <div className="grid w-full grid-cols-10">
      {Array.from({ length: 300 }, (_, i) => {
        const borderR = i % 10 === 9 ? "" : "border-r";
        return (
          <div key={i} className={`aspect-square border-b ${borderR}`}>
          </div>
        );
      })}
    </div>
  );
};

export default Content;
