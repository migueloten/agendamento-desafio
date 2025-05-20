import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import Select from "react-select";

type InputNormalProps = {
	className?: string;
	classNameLabel?: string;
	classNameInput?: string;
	reference: any;
	type?: string;
	min?: string | number;
	max?: string | number;
	disabled?: boolean;
	label?: string;
	placeholder?: string;
	obrigatorio?: boolean;
	register: UseFormRegister<any>;
	errors?: FieldErrors<any>;
};

export function InputNormal({
	className = "",
	classNameLabel = "",
	classNameInput = "",
	register,
	reference,
	errors,
	type,
	min,
	max,
	label,
	placeholder,
	obrigatorio = false,
	disabled = false,
}: InputNormalProps) {
	const errorMessage = errors?.[reference]?.message;
	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			<label
				className={`text-xs uppercase ${errorMessage ? "text-red-600" : "text-cinza-text" } ${classNameLabel} ${
					obrigatorio ? "required" : ""
				}`}
				htmlFor={reference}
			>
				{label}
			</label>
			<input
				{...register(
					reference,
					type === "number" ? { setValueAs: value => (value === "" ? undefined : Number(value)) } : {}
				)}
				className={`text-xs rounded-md border h-10 !px-3 ${
					errorMessage ? "border-s-posativo" : "border-input"
				} ${classNameInput}`}
				type={type}
				disabled={disabled}
				min={min}
				max={max}
				id={reference}
				placeholder={placeholder}
			/>
			{errorMessage && (
				<p className="text-red-500 font-medium text-xs">
					{typeof errorMessage === "string" ? errorMessage : "Campo inválido"}
				</p>
			)}
		</div>
	);
}

type TextAreaProps = {
	className?: string;
	classNameLabel?: string;
	classNameTextArea?: string;
	reference: string;
	rows?: number;
	cols?: number;
	disabled?: boolean;
	label?: string;
	placeholder?: string;
	allowResize?: boolean;
	obrigatorio?: boolean;
	register: UseFormRegister<any>;
	errors?: FieldErrors<any>;
};

export function TextArea({
	className = "",
	classNameLabel = "",
	classNameTextArea = "",
	reference,
	register,
	rows,
	cols,
	label,
	placeholder,
	allowResize = false,
	obrigatorio = false,
	disabled = false,
	errors,
}: TextAreaProps) {
	const errorMessage = errors?.[reference]?.message;

	return (
		<div className={`flex flex-col gap-2 ${className} ${disabled ? "cursor-not-allowed" : ""}`}>
			<label
				className={`text-xs uppercase ${disabled ? "cursor-not-allowed" : ""} ${errorMessage ? "text-red-500" : "text-cinza-text"} ${classNameLabel} ${
					obrigatorio ? "required" : ""
				}`}
				htmlFor={reference}
			>
				{label}
			</label>
			<textarea
				{...register(reference)}
				className={`text-xs rounded-md border border-input !p-3 ${errorMessage ? "border-red-500" : "border-cinza-text"} ${
					allowResize ? "" : "resize-none"
				} ${classNameTextArea} ${disabled ? "cursor-not-allowed" : ""}`}
				name={reference}
				rows={rows}
				cols={cols}
				disabled={disabled}
				id={reference}
				placeholder={placeholder}
			></textarea>

			{errorMessage && (
				<p className="text-red-500 font-medium text-xs">
					{typeof errorMessage === "string" ? errorMessage : "Campo inválido"}
				</p>
			)}
		</div>
	);
}

export interface Option {
	value: string | number;
	label: string;
}

type SelectCustomProps = {
	className?: string;
	classNameLabel?: string;
	classNameSelect?: string;
	bgColor?: string;
	reference: any;
	label?: string;
	placeholder?: string;
	placeholderColor?: string;
	obrigatorio?: boolean;
	disabled?: boolean;
	isMulti?: boolean;
	isClearable?: boolean;
	options: Option[];
	control: Control<any>;
	errors?: FieldErrors<any>;
};

export function SelectCustom({
	className = "",
	classNameLabel = "",
	classNameSelect = "",
	bgColor = "#fff",
	placeholder = "Selecione",
	placeholderColor = "#8B95A8",
	label,
	reference,
	disabled = false,
	obrigatorio,
	isMulti = false,
	isClearable = true,
	control,
	options,
	errors,
}: SelectCustomProps) {
	const errorMessage = errors?.[reference]?.message;
	const customStyles = {
		control: (provided: any, state: any) => ({
			...provided,
			borderRadius: "0.375rem",
			height: isMulti ? "" :"40px",
			fontSize: "12px",
			color: "#000",
			backgroundColor: bgColor,
			borderColor: state.isFocused ? (errorMessage ? "#ff0000" : "#000") : errorMessage ? "#ff0000" : "#000",
			boxShadow: state.isFocused ? (errorMessage ? "0 0 0 1px #ff0000" : "0 0 0 1px #000") : "none",
			"&:hover": {
				borderColor: state.isFocused ? (errorMessage ? "#ff0000" : "#000") : errorMessage ? "#ff0000" : "#000",
			},
		}),
		menuList: (provided: any) => ({
			...provided,
			padding: 0,
		}),
		option: (provided: any, state: any) => ({
			...provided,
			color: state.isSelected ? "#fff" : "#000",
			backgroundColor: state.isSelected ? "#000" : "#fff",
			fontSize: "10px",
		}),
		menu: (provided: any) => ({
			...provided,
			zIndex: 9999,
		}),
		menuPortal: (provided: any) => ({
			...provided,
			zIndex: 9999,
		}),
		placeholder: (provided: any) => ({
			...provided,
			color: placeholderColor,
		}),
	};
	return (
		<div className={`flex flex-col gap-2 ${className} ${disabled ? "cursor-not-allowed" : ""}`}>
			{label && (
				<label
					className={`uppercase text-xs ${errorMessage ? "text-red-500" : "text-cinza-text"} ${classNameLabel} ${
						obrigatorio ? "required" : ""
					}`}
					htmlFor={reference}
				>
					{label}
				</label>
			)}
			<Controller
				name={reference}
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						options={options}
						className={`${classNameSelect}`}
						placeholder={placeholder}
						inputId={reference}
						isDisabled={disabled}
						isClearable={isClearable}
						isMulti={isMulti}
						styles={customStyles}
						menuPortalTarget={document.body}
						maxMenuHeight={200}
						onChange={selectedOption => {
							const value = isMulti
								? (selectedOption as Option[]).map(option => option.value)
								: (selectedOption as Option | null)?.value ?? null;
							field.onChange(value);
						}}
						value={
							isMulti
								? options.filter(option => (field.value || []).includes(option.value))
								: options.find(option => option.value === field.value) || null
						}
						classNames={{
							menu: _ => "!rounded-lg",
							menuList: _ => "!p-0 !rounded-lg",
							option: _ => "hover:!bg-cinza-text",
						}}
					/>
				)}
			/>
			{errorMessage && <p className="text-red-500 font-medium text-xs">Campo inválido</p>}
		</div>
	);
}