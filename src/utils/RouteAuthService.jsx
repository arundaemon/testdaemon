import NotAuthorised from "../pages/NotAuthorised";
import { DecryptData } from "./encryptDecrypt";

const RouteAuthService = ({ route, component }) => {
  let menusAllowed =
    localStorage.getItem("menusAllowed") &&
    localStorage.getItem("menusAllowed") != "undefined"
      ? JSON.parse(localStorage.getItem("menusAllowed"))
      : [];

  if (menusAllowed.find((obj) => obj.route === route)) {
    return component;
  } else {
    return <NotAuthorised isOpen={true} />;
  }
};

export default RouteAuthService;
