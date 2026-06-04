const Button = ({
  children,
  className,
  ...props
}) => {

  return (

    <button
      className={`bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition ${className}`}
      {...props}
    >

      {children}

    </button>

  );

};

export default Button;