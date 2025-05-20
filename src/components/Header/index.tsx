import { Link } from "react-router-dom";
import { LogoNegativo } from "@assets";

export function Header() {
    return(
        <div className="static top-0 w-full h-20 !px-8 flex justify-between text-white bg-gradient-to-r from-[#D64545] via-[#F0733F] to-[#F7A154]">
            <Link to="/home" className="flex items-center justify-center h-full">
                <LogoNegativo className="h-full" />
            </Link>
            <div className="flex items-center justify-between w-fit h-full gap-6">
                <Link to="/especialidades">
                    Especialidades
                </Link>
                <Link to="/convenios">
                    Convênios
                </Link>
                <Link to="/medicos">
                    Médicos
                </Link>
                <Link to="/horarios">
                    Horários
                </Link>
                <Link to="/agendamentos">
                    Agendamentos
                </Link>
                <Link to="/atendimentos">
                    Atendimentos
                </Link>
            </div>
        </div>
    )
}