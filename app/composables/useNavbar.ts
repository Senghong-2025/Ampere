import type { INavbar } from "~/models/navbar";

function useNavbar() {
  const navbars: INavbar[] = [
    {
      name: "Home",
      path: "/",
      isEnabled: true,
      activeTabs: ['/']
    },
    {
      name: "Room",
      path: "/room",
      isEnabled: true,
      activeTabs: ['/room']
    },
    {
      name: "Load",
      path: "/load/details",
      isEnabled: true,
      activeTabs: ['/load/details', '/load/create', '/load/room-load', '/load/generate']
    },
    {
      name: "Setting",
      path: "/setting",
      isEnabled: true,
      activeTabs: ['/setting']
    },
  ];

  const loadRoutes: INavbar[] = [
    {
      name: "Load Details",
      path: "/load/details",
      isEnabled: true
    },
    {
      name: "Create",
      path: "/load/create",
      isEnabled: true
    },
    {
      name: "Room Load",
      path: "/load/room-load",
      isEnabled: true
    },
    {
      name: "Generate Load",
      path: "/load/generate",
      isEnabled: true
    },
  ];

  const shareRoutes: INavbar[] = [
    {
      name: "Load Details",
      path: "/share/load",
      isEnabled: true
    },
  ];

  return { navbars, loadRoutes, shareRoutes };
}

export default useNavbar;
