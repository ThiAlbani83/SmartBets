import { useState } from "react";

const AdminAccordion = ({component, title, height}) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const toggleInviteAccordion = () => {
    setIsInviteOpen(!isInviteOpen);
  };

  return (
    <div
      className={`${
        isInviteOpen ? `${height}` : "h-12"
      } duration-500 w-full bg-white px-4 py-2 rounded-lg overflow-hidden flex flex-col gap-4`}
    >
      <h1
        onClick={toggleInviteAccordion}
        className="flex items-center justify-between w-full text-xl font-semibold cursor-pointer text-primary"
      >
        {title}
        <button className="text-xl font-semibold">
          {" "}
          {isInviteOpen ? <span> - </span> : <span> + </span>}
        </button>
      </h1>
      {component}
    </div>
  );
};

export default AdminAccordion;
