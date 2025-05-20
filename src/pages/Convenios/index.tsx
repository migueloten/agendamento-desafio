import { InputNormal, Modal } from "@components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ConvenioSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, "Nome do convênio é obrigatório"),
});

export type ConvenioType = z.infer<typeof ConvenioSchema>;

export function Convenios() {
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
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<ConvenioType>({resolver: zodResolver(ConvenioSchema)});

    const [convenios, setConvenios] = useState<{id: number; nome: string; }[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/convenios")
            .then((res) => res.json())
            .then((data) => setConvenios(data))
            .catch((err) => console.error("Erro ao buscar convênios:", err));
    }, []);


    const onSubmit = (data: ConvenioType) => {
        data.id = convenios[convenios.length - 1]?.id + 1 || 1;
        fetch("http://localhost:3000/convenios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((newConvenio) => {
                setConvenios((prev) => [...prev, newConvenio]);
                closeModal();
            })
            .catch((err) => console.error("Erro ao adicionar convênio:", err));
    };


    return(
        <div className="flex flex-col gap-6 w-full h-full p-4">
            <Modal modalTitle="Cadastro de convênio" showModal={showModal} onClose={closeModal} width="w-[600px]">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 !mt-4 justify-between h-full">
                    <InputNormal
                        className="w-full"
                        reference="nome"
                        register={register}
                        label="Nome do convênio"
                        placeholder="Digite o nome do convênio"
                        type="text"
                        errors={errors}
                        obrigatorio
                    />
                    <div className="flex justify-end mt-4">
                        <button className="bg-secondary text-white rounded-md !px-4 !py-2" type="submit">Salvar</button>
                    </div>
                </form>
            </Modal>
            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold text-cinza-text">Convênios</h1>
                <button className="bg-secondary text-white rounded-md !px-4 !py-2" type="button" onClick={openModal}>
                    Adicionar convênio
                </button>
            </div>

            <table className="">
                <thead className="bg-gradient-to-r from-[#D64545] via-[#F0733F] to-[#F7A154] text-white">
                    <tr>
                        <th className="h-15 w-1/2 !px-8 border-b text-left">Convênio</th>
                    </tr>
                </thead>
                <tbody>
                    {convenios.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#b8b8b893]">
                            <td className="!px-8 !py-4">{item.nome}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}