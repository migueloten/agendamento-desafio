import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ModalProps {
	children: React.ReactNode;
	showModal: boolean;
	onClose: () => void;
	modalTitle?: string;
	titleStyle?: string;
	width?: string;
}

export function Modal({ children, showModal, onClose, modalTitle, titleStyle, width }: ModalProps) {
	return (
		<div
			className={`${
				showModal ? "flex" : "hidden"
			} justify-center items-center w-screen h-screen fixed left-0 top-0 bg-black/70 z-50 !p-[80px]`}
		>
			<div className={`flex flex-col !p-6 bg-white rounded-md z-50 ${width ?? ""}`}>
				<div className="w-full flex justify-between mb-[5px]">
					<p className={`text-cinza-text text-xl font-bold ${titleStyle}`}>{modalTitle}</p>
					<button className="text-secondary" type="button" onClick={onClose}>
						<FontAwesomeIcon size="xl" icon={faXmark} />
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
