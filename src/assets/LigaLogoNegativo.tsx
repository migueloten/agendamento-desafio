import img from "./img/liga-logo-negativo.png";

interface LogoNegativoProps {
    className?: string;
}

export function LogoNegativo({ className }: LogoNegativoProps) {
    return <img alt="Logo Liga" className={className} src={img} />;
}
