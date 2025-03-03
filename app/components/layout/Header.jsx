"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FiBell } from "react-icons/fi";
import { Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || "Guest";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=random&color=fff`;

  return (
    <div className="flex items-center justify-between bg-white shadow-md p-4">
      {/* Sidebar Toggler (Always on the left) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-gray-600 p-2 rounded-lg hover:bg-gray-200"
      >
        <Menu size={24} />
      </button>

      {/* Bell Icon (Left on large screens, inside right div on small screens) */}
      <div className="hidden lg:block">
        <button className="relative text-gray-600 hover:text-gray-800">
          <FiBell className="text-2xl" />
        </button>
      </div>

      {/* Bell & Profile (Grouped on small screens, separate on large screens) */}
      <div className="flex items-center space-x-3 lg:space-x-0 lg:flex-row-reverse">
        <Image
          src={avatarUrl}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full object-cover"
          loading="lazy"
        />
        <button className="lg:hidden relative text-gray-600 hover:text-gray-800">
          <FiBell className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default Header;
