import { createContext, useContext } from "react";

const HeaderContext = createContext(null);

export function useHeader() {
  return useContext(HeaderContext);
}

export default HeaderContext;