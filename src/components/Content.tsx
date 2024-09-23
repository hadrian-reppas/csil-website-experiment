const Content: React.FC<{}> = ({}) => {
  return (
    <div className="grid w-full grid-cols-10 divide-x divide-y">
      {Array.from({ length: 200 }, (_, i) => {
        const row = Math.floor(i / 10);
        const col = i % 10;
        return (
          <div key={i} className="flex aspect-square items-center justify-center">
          </div>
        );
      })}
    </div>
  );
};

export default Content;
