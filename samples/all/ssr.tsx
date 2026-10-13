import { renderToString } from "react-dom/server";
import Sample from "./App.tsx";
export const render = () => renderToString(<Sample />);
