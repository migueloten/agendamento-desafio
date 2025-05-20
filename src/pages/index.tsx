import { Header } from "@components";
import { Outlet } from "react-router-dom";

export function Base() {
	return (
		<div className="h-screen w-screen flex flex-col overflow-hidden">
			<Header />
            <div className="flex overflow-auto h-full !p-8">
				<Outlet />
			</div>
		</div>
	);
}
