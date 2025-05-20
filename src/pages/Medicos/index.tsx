import { InputNormal, Modal, SelectCustom } from "@components";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MedicoSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, "Nome é obrigatório"),
    crm: z.string().min(1, "CRM é obrigatório"),
    especialidadeId: z.number().optional(),
    especialidadeNome: z.string().optional(),
});

export type MedicoType = z.infer<typeof MedicoSchema>;

export function Medicos() {
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => {
        setShowModal(false);
        reset();
    }
    const openModal = () => {
        setShowModal(true);
    }

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<MedicoType>({resolver: zodResolver(MedicoSchema)});

    const [medicos, setMedicos] = useState<{id: number; nome: string; crm: number; especialidadeId: number, especialidadeNome: string}[]>([]);
    const [especialidades, setEspecialidades] = useState<{id: number; nome: string}[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/medicos")
            .then((res) => res.json())
            .then((data) => setMedicos(data))
            .catch((err) => console.error("Erro ao buscar médicos:", err));

        fetch("http://localhost:3000/especialidades")
            .then((res) => res.json())
            .then((data) => setEspecialidades(data))
            .catch((err) => console.error("Erro ao buscar especialidades:", err));
    }, []);

    const [options, setOptions] = useState<{ value: number; label: string }[]>([]);
    useEffect(() => {
        if (especialidades.length > 0) {
            const options = especialidades.map((item) => ({
                value: item.id,
                label: item.nome,
            }));
            setOptions(options);
        }
    }, [especialidades]);

    const onSubmit = (data: MedicoType) => {
        data.id = medicos[medicos.length - 1]?.id + 1 || 1;
        data.especialidadeNome = especialidades.find((item) => item.id === Number(data.especialidadeId))?.nome || "";
        fetch("http://localhost:3000/medicos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((newMedico) => {
                setMedicos((prev) => [...prev, newMedico]);
                closeModal();
            })
            .catch((err) => console.error("Erro ao adicionar médico:", err));
    };

    return(
        <div className="flex flex-col gap-6 w-full h-full p-4">
            <Modal modalTitle="Cadastro do médico" showModal={showModal} onClose={closeModal} width="w-[600px]">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 !mt-4 justify-between h-full">
                    <InputNormal
                        className="w-full"
                        reference="nome"
                        register={register}
                        label="Nome do médico"
                        placeholder="Digite o nome do médico"
                        type="text"
                        errors={errors}
                        obrigatorio
                    />
                    <InputNormal
                        className="w-full"
                        reference="crm"
                        register={register}
                        label="CRM do médico"
                        placeholder="Digite o CRM do médico"
                        type="text"
                        errors={errors}
                        obrigatorio
                    />
                    <SelectCustom
                        className="w-full"
                        reference="especialidadeId"
                        control={control}
                        label="Especialidade do médico"
                        placeholder="Selecione a especialidade do médico"
                        errors={errors}
                        obrigatorio
                        options={options}
                    />

                    <div className="flex justify-end mt-4">
                        <button className="bg-secondary text-white rounded-md !px-4 !py-2" type="submit">Salvar</button>
                    </div>
                </form>
            </Modal>


            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold text-cinza-text">Médicos</h1>
                <button className="bg-secondary text-white rounded-md !px-4 !py-2" type="button" onClick={openModal}>
                    Adicionar médico
                </button>
            </div>

            <table className="">
                <thead className="bg-gradient-to-r from-[#D64545] via-[#F0733F] to-[#F7A154] text-white">
                    <tr>
                        <th className="h-15 w-1/2 !px-8 border-b text-left">CRM</th>
                        <th className="h-15 w-1/2 !px-8 border-b text-left">Nome</th>
                        <th className="h-15 w-1/2 !px-8 border-b text-left">Especialidade</th>
                        <th className="h-15 w-1/2 !px-8 border-b text-left">Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {medicos.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#b8b8b893]">
                            <td className="!px-8 !py-4">{item.crm}</td>
                            <td className="!px-8 !py-4">{item.nome}</td>
                            <td className="!px-8 !py-4">{item.especialidadeNome}</td>
                            <td className="!px-8 !py-4 text-center">
                                <button type="button">
                                    <FontAwesomeIcon className="text-secondary" icon={faPenToSquare} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}