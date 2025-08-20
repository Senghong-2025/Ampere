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

  return { navbars };
}

export default useNavbar;
