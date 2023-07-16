import React from "react";

const Input = ({ error, name, type, label = "text", ...rest }) => {
  return (
    <label className="w-full text-center flex flex-col gap-3">
      <input
        {...rest}
        type={type}
        required={true}
        name={name}
        className="outline-none rounded-2xl text-white bg-transparent text-xl border border-[#063abe] w-full px-4 py-2 active:border-[#ff004c] focus:border-[#ff004c]"
        placeholder={label}
        autoComplete="false"
      />
      {error?.length > 2 && (
        <span className="text-red-500 p-2 text-xl">{error}</span>
      )}
    </label>
  );
};

export default Input;
