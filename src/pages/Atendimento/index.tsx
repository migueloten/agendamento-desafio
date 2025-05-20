import { Modal, SelectCustom, TextArea } from "@components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { AgendamentoType } from "../Agendamentos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import { dateBR } from "@utils";

const AtendimentoSchema = z.object({
    id: z.number().optional(),
    agendamentoId: z.number().optional(),
    data: z.string().optional(),
    resolucao: z.string().optional(),
    observacoes: z.string().optional(),
});

export type AtendimentoType = z.infer<typeof AtendimentoSchema>;

export function Atendimentos() {
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => {
        setShowModal(false);
        reset();
        setAgendamentoSelected(null);
    }
    const openModal = () => {
        setShowModal(true);
    }

    const [showModalVisualizar, setShowModalVisualizar] = useState(false);
    const closeModalVisualizar = () => {
        setShowModalVisualizar(false);
        reset();
        setAgendamentoSelected(null);
    }
    const openModalVisualizar = () => {
        setShowModalVisualizar(true);
    }

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<AtendimentoType>({
            resolver: zodResolver(AtendimentoSchema)
        });

    const [agendamentos, setAgendamentos] = useState<AgendamentoType[]>([]);
    const [atendimentos, setAtendimentos] = useState<AtendimentoType[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/agendamentos")
            .then((res) => res.json())
            .then((data) => setAgendamentos(data))
            .catch((err) => console.error("Erro ao buscar agendamentos:", err));
        fetch("http://localhost:3000/atendimentos")
            .then((res) => res.json())
            .then((data) => setAtendimentos(data))
            .catch((err) => console.error("Erro ao buscar atendimentos:", err));
    }, []);

    const [agendamentoSelected, setAgendamentoSelected] = useState<AgendamentoType | null>(null);

    const selectAgendamento = (id: number) => {
        const agendamento = agendamentos.find((item) => item.id === id);
        if (agendamento) {
            setAgendamentoSelected(agendamento);
            if (agendamento.status === "Pendente") {
                openModal();
            } else {
                openModalVisualizar();
            }
        }
    }

    const resolucoesOptions = [
        { value: "Realizado", label: "Realizado" },
        { value: "Não compareceu", label: "Não compareceu" },
        { value: "Cancelado", label: "Cancelado" },
    ]


    const onSubmit = (data: AtendimentoType) => {
        data.id = ((agendamentos[agendamentos.length - 1]?.id ?? 0) + 1) || 1;
        data.agendamentoId = agendamentoSelected?.id;
        data.data = new Date().toISOString();
        
        fetch("http://localhost:3000/atendimentos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((newAg) => {
                console.log("Atualização no agendamento:", newAg);

                fetch(
                    `http://localhost:3000/agendamentos/${agendamentoSelected?.id}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            status: data.resolucao,
                        }),
                    }
                );
            })
            .then(() => {
                setAtendimentos((prev) => [...prev, data]);
                console.log("Atendimento salvo com sucesso!");
                closeModal();
            })
            .catch((err) => console.error("Erro ao adicionar atendimento:", err));
    }

    return (
        <div className="flex flex-col gap-6 w-full h-full p-4">
            <Modal modalTitle="Realizar Atendimento" showModal={showModal} onClose={closeModal} width="w-[600px]">
                <div className="flex flex-col gap-1 !mt-4">
                    <h1 className="text-lg font-bold">Dados do Agendamento</h1>
                    <div className="flex flex-col gap-0.5 text-sm">
                        <p>Paciente: {agendamentoSelected?.paciente}</p>
                        <p>Convênio: {agendamentoSelected?.convenioNome}</p>
                        <p>Médico: {agendamentoSelected?.medicoNome}</p>
                        <p>Especialidade: {agendamentoSelected?.especialidadeNome}</p>
                        <p>Data do agendamento: {dateBR(agendamentoSelected?.data)}</p>
                        <p>Hora do agendamento: {agendamentoSelected?.hora}</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 !mt-4 justify-between h-full">
                    <TextArea
                        className="w-full"
                        reference="observacoes"
                        register={register}
                        rows={4}
                        label="Observações"
                        placeholder="Digite as observações do atendimento"
                        errors={errors}
                        obrigatorio
                    />
                    <SelectCustom
                        className="w-full"
                        reference="resolucao"
                        control={control}
                        label="Resolução"
                        placeholder="Selecione a resolução do atendimento"
                        options={resolucoesOptions}
                        errors={errors}
                        obrigatorio
                    />

                    <div className="flex justify-end mt-4">
                        <button className="bg-secondary text-white rounded-md !px-4 !py-2" type="submit">Salvar</button>
                    </div>
                </form>
            </Modal>

            <Modal modalTitle="Visualizar Atendimento" showModal={showModalVisualizar} onClose={closeModalVisualizar} width="w-[600px]">
                <div className="flex flex-col gap-1 !mt-4">
                    <h1 className="text-lg font-bold">Dados do Agendamento</h1>
                    <div className="flex flex-col gap-0.5 text-sm">
                        <p>Paciente: {agendamentoSelected?.paciente}</p>
                        <p>Convênio: {agendamentoSelected?.convenioNome}</p>
                        <p>Médico: {agendamentoSelected?.medicoNome}</p>
                        <p>Especialidade: {agendamentoSelected?.especialidadeNome}</p>
                        <p>Data do agendamento: {dateBR(agendamentoSelected?.data)}</p>
                        <p>Hora do agendamento: {agendamentoSelected?.hora}</p>
                    </div>
                </div>
                <div>
                    <h1 className="text-lg font-bold !mt-2">Dados do Atendimento</h1>
                    <div className="flex flex-col gap-0.5 text-sm">
                        <p>Data do atendimento: {dateBR(atendimentos.find(item => item.agendamentoId === agendamentoSelected?.id)?.data)}</p>
                        <p>Resolução: {atendimentos.find(item => item.agendamentoId === agendamentoSelected?.id)?.resolucao}</p>
                        <p>Observações: {atendimentos.find(item => item.agendamentoId === agendamentoSelected?.id)?.observacoes}</p>
                    </div>
                </div>
            </Modal>

            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold text-cinza-text">Atendimentos</h1>
            </div>

            <table className="">
                <thead className="bg-gradient-to-r from-[#D64545] via-[#F0733F] to-[#F7A154] text-white">
                    <tr>
                        <th className="h-15 text-center">Paciente</th>
                        <th className="h-15 text-center">Convênio</th>
                        <th className="h-15 text-center">Médico</th>
                        <th className="h-15 text-center">Especialidade</th>
                        <th className="h-15 text-center">Data</th>
                        <th className="h-15 text-center">Hora</th>
                        <th className="h-15 text-center">Status</th>
                        <th className="h-15 text-center">Ações</th>	
                    </tr>
                </thead>
                <tbody>
                    {agendamentos.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#b8b8b893]">
                            <td className="!py-4 text-center">{item.paciente}</td>
                            <td className="!py-4 text-center">{item.convenioNome}</td>
                            <td className="!py-4 text-center">{item.medicoNome}</td>
                            <td className="!py-4 text-center">{item.especialidadeNome}</td>
                            <td className="!py-4 text-center">{dateBR(item.data)}</td>
                            <td className="!py-4 text-center">{item.hora}</td>
                            <td className="!py-4 text-center">{item.status}</td>
                            <td className="!py-4 text-center">
                                { item.status == "Pendente" && <button type="button" title="Realizar atendimento" onClick={() => selectAgendamento(item.id ? item.id : 0)} className="text-secondary">
                                    <FontAwesomeIcon size="xl" icon={faNotesMedical} />
                                </button>}
                                { item.status !== "Pendente" && <button type="button" title="Visualizar atendimento" onClick={() => selectAgendamento(item.id ? item.id : 0)} className="text-secondary">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}