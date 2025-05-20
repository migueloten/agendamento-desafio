import { InputNormal, Modal, SelectCustom } from "@components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { MedicoType } from "../Medicos";
import type { EspecialidadeType } from "../Especialidades";
import type { ConvenioType } from "../Convenios";
import type { HorarioType } from "../Horarios";

const AgendamentoSchema = z.object({
    id: z.number().optional(),
    paciente: z.string().optional(),
    especialidadeNome: z.string().optional(),
    especialidadeId: z.number().optional(),
    convenioNome: z.string().optional(),
    convenioId: z.number().optional(),
    medicoNome: z.string().optional(),
    medicoId: z.number().min(1, "Médico é obrigatório"),
    data: z.string().optional(),
    hora: z.string().optional(),
    status: z.string().optional()
});

export type AgendamentoType = z.infer<typeof AgendamentoSchema>;

export function Agendamentos() {
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
        watch,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<AgendamentoType>({
        defaultValues: {
            status: "Pendente",
        },
        resolver: zodResolver(AgendamentoSchema)
    });

    const [horarios, setHorarios] = useState<HorarioType[]>([]);
    const [medicos, setMedicos] = useState<MedicoType[]>([]);
    const [especialidades, setEspecialidades] = useState<EspecialidadeType[]>([]);
    const [convenios, setConvenios] = useState<ConvenioType[]>([]);
    const [agendamentos, setAgendamentos] = useState<AgendamentoType[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/especialidades")
            .then((res) => res.json())
            .then((data) => setEspecialidades(data))
            .catch((err) => console.error("Erro ao buscar especialidades:", err));
        fetch("http://localhost:3000/medicos")
            .then((res) => res.json())
            .then((data) => setMedicos(data))
            .catch((err) => console.error("Erro ao buscar medicos:", err));
        fetch("http://localhost:3000/horarios")
            .then((res) => res.json())
            .then((data) => setHorarios(data))
            .catch((err) => console.error("Erro ao buscar horários:", err));
        fetch("http://localhost:3000/convenios")
            .then((res) => res.json())
            .then((data) => setConvenios(data))
            .catch((err) => console.error("Erro ao buscar convênios:", err));
        fetch("http://localhost:3000/agendamentos")
            .then((res) => res.json())
            .then((data) => setAgendamentos(data))
            .catch((err) => console.error("Erro ao buscar agendamentos:", err));
    }, []);

    const [conveniosOptions, setConveniosOptions] = useState<{ value: number; label: string }[]>([]);
    useEffect(() => {
        if (convenios.length > 0) {
            const options = convenios.map((item) => ({
                value: item.id as number,
                label: item.nome,
            }));
            setConveniosOptions(options);
        }
    }, [convenios]);

    const [especialidadesOptions, setEspecialidadesOptions] = useState<{ value: number; label: string }[]>([]);
    useEffect(() => {
        if (especialidades.length > 0) {
            const options = especialidades.map((item) => ({
                value: item.id as number,
                label: item.nome,
            }));
            setEspecialidadesOptions(options);
        }
    }, [especialidades]);

    const [medicosOptions, setMedicosOptions] = useState<{ value: number; label: string }[]>([]);
    useEffect(() => {
        if (medicos.length > 0) {
            const options = medicos
                .filter((item) => item.especialidadeId == watch("especialidadeId"))
                .map((item) => ({
                    value: item.id as number,
                    label: item.nome,
                }));
            setMedicosOptions(options);
        }
    }, [medicos, watch("especialidadeId")]);

    const [dataOptions, setDataOptions] = useState<{ value: string; label: string }[]>([]);
    useEffect(() => {
        const medicoId = watch("medicoId");
        if (medicoId && horarios.length > 0) {
            const seen = new Set<string>();
            const options = horarios
                .filter((item) => item.medicoId === medicoId)
                .filter((item) => {
                    if (!item.data) return false;
                    if (seen.has(item.data)) return false;
                    seen.add(item.data);
                    return true;
                })
                .map((item) => {
                    const [year, month, day] = (item.data ?? "").split("-");
                    const formatted = day && month && year ? `${day}/${month}/${year}` : item.data ?? "";
                    return {
                        value: item.data as string,
                        label: formatted,
                    };
                });
            setDataOptions(options);
        } else {
            setDataOptions([]);
        }
    }, [horarios, watch("medicoId")]);

    const [horariosOptions, setHorariosOptions] = useState<{ value: string; label: string }[]>([]);
    const dataSelecionada = watch("data");
    const medicoSelecionado = watch("medicoId");

    useEffect(() => {
        if (!dataSelecionada || !medicoSelecionado) {
            setHorariosOptions([]);
            return;
        }

        // 1) pega todos os blocos daquele médico na data
        const blocosDoDia = horarios.filter(
            (h) => h.data === dataSelecionada && h.medicoId === medicoSelecionado
        );

        // 2) gera todos os slots de cada bloco
        let todosSlots: string[] = [];
        blocosDoDia.forEach((bloco) => {
            if (!bloco.horaInicio || !bloco.horaFim) return;
            const duracao = bloco.duracaoConsultaMinutos ?? 30;
            const [hIni, mIni] = bloco.horaInicio.split(":").map(Number);
            const [hFim, mFim] = bloco.horaFim.split(":").map(Number);
            let cursor = hIni * 60 + mIni;
            const fim = hFim * 60 + mFim;

            while (cursor + duracao <= fim) {
                const hh = String(Math.floor(cursor / 60)).padStart(2, "0");
                const mm = String(cursor % 60).padStart(2, "0");
                todosSlots.push(`${hh}:${mm}`);
                cursor += duracao;
            }
        });

        // 3) remove duplicatas (caso blocos se sobreponham)
        const uniqueSlots = Array.from(new Set(todosSlots));

        // 4) busca quais já estão agendados
        const bloqueados = agendamentos
            .filter(
                (a) =>
                    a.data === dataSelecionada &&
                    a.medicoId === medicoSelecionado &&
                    typeof a.hora === "string"
            )
            .map((a) => a.hora as string);

        // 5) filtra só os disponíveis e ordena
        const disponiveis = uniqueSlots
            .filter((s) => !bloqueados.includes(s))
            .sort();

        // 6) atualiza o state
        setHorariosOptions(disponiveis.map((s) => ({ value: s, label: s })));
    }, [dataSelecionada, medicoSelecionado, horarios, agendamentos]);

    const onSubmit = (data: AgendamentoType) => {
        data.id = ((agendamentos[agendamentos.length - 1]?.id ?? 0) + 1) || 1;
        data.especialidadeNome = especialidades.find((item) => item.id === Number(data.especialidadeId))?.nome || "";
        data.convenioNome = convenios.find((item) => item.id === Number(data.convenioId))?.nome || "";
        data.medicoNome = medicos.find((item) => item.id === Number(data.medicoId))?.nome || "";
        
        fetch("http://localhost:3000/agendamentos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((newAg) => {
                console.log("Novo agendamento:", newAg);

                const bloco = horarios.find(
                    (h) =>
                        h.medicoId === newAg.medicoId &&
                        h.data === newAg.data &&
                        h.horaInicio &&
                        h.horaFim &&
                        newAg.hora &&
                        // Verifica se a hora selecionada está dentro do intervalo do bloco
                        (() => {
                            const [hIni, mIni] = h.horaInicio.split(":").map(Number);
                            const [hFim, mFim] = h.horaFim.split(":").map(Number);
                            const [hSel, mSel] = newAg.hora.split(":").map(Number);
                            const iniMin = hIni * 60 + mIni;
                            const fimMin = hFim * 60 + mFim;
                            const selMin = hSel * 60 + mSel;
                            return selMin >= iniMin && selMin + (h.duracaoConsultaMinutos ?? 30) <= fimMin;
                        })()
                );
                if (!bloco || bloco.id == null) {
                    console.error("Bloco não encontrado!");
                    return;
                }

                console.log("Bloco encontrado:", bloco);

                const updatedSlots = (bloco.agendamentosId ?? []).map((slot) =>
                    slot.horario === newAg.hora
                        ? { ...slot, marcado: true }
                        : slot
                );

                fetch(
                    `http://localhost:3000/horarios/${bloco.id}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            agendamentosId: updatedSlots,
                        }),
                    }
                );

            })
            .then(() => {
                setAgendamentos((prev) => [...prev, data]);
                console.log("Agendamento salvo com sucesso!");
                closeModal();
            })
            .catch((err) => console.error("Erro ao adicionar agendamento:", err));
    }

    return (
        <div className="flex flex-col gap-6 w-full h-full p-4">
            <Modal modalTitle="Agendamento de consulta" showModal={showModal} onClose={closeModal} width="w-[600px]">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 !mt-4 justify-between h-full">
                    <InputNormal
                        className="w-full"
                        reference="paciente"
                        register={register}
                        label="Nome do paciente"
                        placeholder="Nome do paciente"
                        type="text"
                        errors={errors}
                        obrigatorio
                    />
                    <SelectCustom
                        className="w-full"
                        reference="convenioId"
                        control={control}
                        label="Convênio"
                        placeholder="Selecione o convênio"
                        options={conveniosOptions}
                        errors={errors}
                        obrigatorio
                    />
                    <SelectCustom
                        className="w-full"
                        reference="especialidadeId"
                        control={control}
                        label="Especialidade"
                        placeholder="Selecione a especialidade"
                        options={especialidadesOptions}
                        errors={errors}
                        obrigatorio
                    />
                    <SelectCustom
                        className="w-full"
                        reference="medicoId"
                        control={control}
                        label="Médico"
                        placeholder="Selecione o médico"
                        options={medicosOptions}
                        errors={errors}
                        disabled={watch("especialidadeId") === undefined}
                        obrigatorio
                    />
                    <SelectCustom
                        className="w-full"
                        reference="data"
                        control={control}
                        label="Data"
                        placeholder="Selecione a data"
                        options={dataOptions}
                        errors={errors}
                        disabled={watch("medicoId") === undefined}
                        obrigatorio
                    />
                    <SelectCustom
                        className="w-full"
                        reference="hora"
                        control={control}
                        label="Horário"
                        placeholder="Selecione o horário"
                        options={horariosOptions}
                        errors={errors}
                        disabled={watch("data") === undefined}
                        obrigatorio
                    />

                    <div className="flex justify-end mt-4">
                        <button className="bg-secondary text-white rounded-md !px-4 !py-2" type="submit">Salvar</button>
                    </div>
                </form>
            </Modal>

            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold text-cinza-text">Agendamentos</h1>
                <button className="bg-secondary text-white rounded-md !px-4 !py-2" type="button" onClick={openModal}>
                    Agendar consulta
                </button>
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
                    </tr>
                </thead>
                <tbody>
                    {agendamentos.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#b8b8b893]">
                            <td className="!py-4 text-center">{item.paciente}</td>
                            <td className="!py-4 text-center">{item.convenioNome}</td>
                            <td className="!py-4 text-center">{item.medicoNome}</td>
                            <td className="!py-4 text-center">{item.especialidadeNome}</td>
                            <td className="!py-4 text-center">
                            {item.data ? (() => {
                                const [year, month, day] = item.data.split("-");
                                return day && month && year ? `${day}/${month}/${year}` : item.data;
                            })() : ""}</td>
                            <td className="!py-4 text-center">{item.hora}</td>
                            <td className="!py-4 text-center">{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}