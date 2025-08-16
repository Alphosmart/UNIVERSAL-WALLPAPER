import { createContext, useContext } from "react";

export const Context = createContext(null);

export default Context;

export const useAppContext = () => {
    return useContext(Context);
};
