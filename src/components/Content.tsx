const Content: React.FC = () => {
  return (
    <div className="grid w-full grid-cols-10">
      {Array.from({ length: 50 }, (_, i) => {
        return <div key={i} className="aspect-square"></div>;
      })}
    </div>
  );
};

export default Content;
