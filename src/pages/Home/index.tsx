import { BGIMG, LogoNegativo } from "@assets";
import { Link } from "react-router-dom";

export function Home() {
    return (
        <div className="relative min-h-screen min-w-screen w-full h-full flex items-center justify-center bg-gradient-to-r from-[#D64545] via-[#F0733F] to-[#F7A154]">
            {/* Plano de fundo */}
            <BGIMG className="absolute inset-0 w-full h-full object-cover opacity-30 z-0" />

            {/* Links centralizados acima do plano de fundo */}
            <div className="relative z-10 flex flex-col items-start w-1/2 text-[35px] text-white gap-5">
                <Link className="!px-4 !py-1 rounded-md hover:bg-white/50 hover:text-secondary" to="/especialidades">Especialidades</Link>
                <Link className="!px-4 !py-1 rounded-md hover:bg-white/50 hover:text-secondary" to="/convenios">Convênios</Link>
                <Link className="!px-4 !py-1 rounded-md hover:bg-white/50 hover:text-secondary" to="/medicos">Médicos</Link>
                <Link className="!px-4 !py-1 rounded-md hover:bg-white/50 hover:text-secondary" to="/horarios">Horários</Link>
                <Link className="!px-4 !py-1 rounded-md hover:bg-white/50 hover:text-secondary" to="/agendamentos">Agendamentos</Link>
                <Link className="!px-4 !py-1 rounded-md hover:bg-white/50 hover:text-secondary" to="/atendimentos">Atendimentos</Link>
            </div>

            {/* Logo fixa no topo direito */}
            <LogoNegativo className="fixed top-1 right-1 z-20" />
        </div>
    );
}