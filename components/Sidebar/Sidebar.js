import React from "react";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__container">

        <div className="sidebar__bottom">

          <Link href="https://bacode.com.ar/" passHref>
            <a target='_blank' >

              <Image src="/bodie.png" alt="avatar" width="50" height="50" />
              <h2>Bodie</h2>
            </a>
          </Link>

        </div>


      </div>
    </div>
  );
};

export default Sidebar;
