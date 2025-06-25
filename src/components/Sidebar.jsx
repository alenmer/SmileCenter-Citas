import React from "react";
import { PiListChecksBold } from "react-icons/pi";
import { BiSolidCalendarCheck } from "react-icons/bi";
import { FaBars, FaPowerOff } from "react-icons/fa";

export default function Sidebar({
  isMobile = false,
  showMobileMenu = false,
  toggleMobileMenu = () => {},
  onNavigateMisCitas = () => {},
  onNavigateAgendarCita = () => {},
  onLogout = () => {},
}) {
  const MenuItems = () => (
    <>
      <div className="d-flex align-items-center gap-2 mb-2">
        <PiListChecksBold size={20} color="#FFFFFF" />
        <span className="sidebar-link" onClick={onNavigateMisCitas}>
          Mis citas
        </span>
      </div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <BiSolidCalendarCheck size={20} color="#FFFFFF" />
        <span className="sidebar-link" onClick={onNavigateAgendarCita}>
          Agendar cita
        </span>
      </div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <FaPowerOff size={20} color="#FFFFFF" />
        <span className="sidebar-link" onClick={onLogout}>
          Cerrar sesión
        </span>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <div className="mobile-header d-md-none d-flex justify-content-between align-items-center px-3 py-3">
          <button className="menu-toggle" onClick={toggleMobileMenu}>
            <FaBars size={20} color="#ffffff" />
          </button>
          <img
            src="/logo-smile-center2.png"
            alt="Smile Center"
            className="mobile-logo"
          />
        </div>

        {showMobileMenu && (
          <div className="mobile-menu d-flex flex-column p-3">
            <MenuItems />
          </div>
        )}
      </>
    );
  }

  return (
    <aside className="p-4 d-none d-md-flex flex-column justify-content-between sidebar">
      <div className="d-flex flex-column align-items-start w-100">
        <div className="w-100 text-center mb-4">
          <img
            src="/logo-smile-center2.png"
            alt="Smile Center"
            className="sidebar-logo"
          />
        </div>
        <nav className="d-flex flex-column gap-3 w-100 px-2">
          <MenuItems />
        </nav>
      </div>
    </aside>
  );
}
