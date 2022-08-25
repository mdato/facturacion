import React from "react";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__container">
        

        <div className="sidebar__bottom">
          <Image src="/bodie.png" alt="avatar" width="50" height="50" />
          <h2>Bodie</h2>
        </div>
        

      </div>
    </div>
  );
};

export default Sidebar;
