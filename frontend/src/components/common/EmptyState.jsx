const EmptyState = ({
  title,
}) => {

  return (

    <div className="flex flex-col items-center justify-center py-20">

      <h1 className="text-3xl font-bold">
        {title}
      </h1>

    </div>

  );

};

export default EmptyState;