import type { INavbar } from "~/models/navbar";

function useNavbar() {
  const navbars: INavbar[] = [
    {
      name: "Home",
      path: "/",
      isEnabled: true
    },
    {
      name: "Room",
      path: "/room",
      isEnabled: true
    },
    {
      name: "Load",
      path: "/load",
      isEnabled: true
    },
    {
      name: "Setting",
      path: "/setting",
      isEnabled: true
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
