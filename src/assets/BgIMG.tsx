import img from "./img/background-image.png";

interface BGIMGProps {
    className?: string;
}

export function BGIMG({ className }: BGIMGProps) {
	return <img alt="Imagem de fundo" className={className} src={img} />;
}
