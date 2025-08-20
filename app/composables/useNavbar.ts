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
    // {
    //   name: "Cable Sizing",
    //   path: "/cable-sizing",
    //   isEnabled: false
    // },
    // {
    //   name: "Voltage Drop",
    //   path: "/voltage-drop",
    //   isEnabled: false
    // },
  ];

  const loadRoutes: INavbar[] = [
    {
      name: "Load",
      path: "/load",
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
    {
      name: "Load Details",
      path: "/load/details",
      isEnabled: true
    },
  ];

  return { navbars, loadRoutes };
}

export default useNavbar;
