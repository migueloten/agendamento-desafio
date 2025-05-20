import "./global.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Base } from "./pages";
import { ErrorPage } from "./pages/ErrorPage";
import { Especialidades } from "./pages/Especialidades";
import { Convenios } from "./pages/Convenios";
import { Home } from "./pages/Home";
import { Medicos } from "./pages/Medicos";
import { Horarios } from "./pages/Horarios";
import { Agendamentos } from "./pages/Agendamentos";
import { Atendimentos } from "./pages/Atendimento";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Base />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "especialidades",
				element: <Especialidades />,
			},
			{
				path: "convenios",
				element: <Convenios />,
			},
			{
				path: "medicos",
				element: <Medicos />,
			},
			{
				path: "horarios",
				element: <Horarios />,
			},
			{
				path: "agendamentos",
				element: <Agendamentos />,
			},
			{
				path: "atendimentos",
				element: <Atendimentos />,
			}
		],
	},
	{
		path: "home",
		element: <Home />,
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
