import { InputNormal, Modal, SelectCustom } from "@components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { MedicoType } from "../Medicos";
import type { EspecialidadeType } from "../Especialidades";

const HorarioSchema = z.object({
    id: z.number().optional(),
    medicoNome: z.string().optional(),
    medicoId: z.number().min(1, "Médico é obrigatório"),
    especialidadeNome: z.string().optional(),
    especialidadeId: z.number().optional(),
    data: z.string().optional(),
    horaInicio: z.string().optional(),
    horaFim: z.string().optional(),
    duracaoConsultaMinutos: z.number().optional(),
    quantAgendamentos: z.number().optional(),
    agendamentosId: z.array(z.object({
        horario: z.string().optional(),
        marcado: z.boolean().optional(),
    })).optional(),
});

export type HorarioType = z.infer<typeof HorarioSchema>;

type DayType = {
    data: string;
    diaNum: number;
    diaSemana: string;
    mesNome: string;
    anoNum: number;
    horarios: HorarioType[];
};

export function Horarios() {
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
        setValue,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<HorarioType>({
        defaultValues: {
            agendamentosId: [],
            duracaoConsultaMinutos: 10,
        },
        resolver: zodResolver(HorarioSchema)
    });

    const [horarios, setHorarios] = useState<HorarioType[]>([]);
    const [medicos, setMedicos] = useState<MedicoType[]>([]);
    const [especialidades, setEspecialidades] = useState<EspecialidadeType[]>([]);

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
            .catch((err) => console.error("Erro ao buscar horarios:", err));
    }, []);

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

    const [intervaloDias, setIntervaloDias] = useState<DayType[]>([]);
    useEffect(() => {
        console.log("horarios", horarios);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ultimoDia = new Date();
        ultimoDia.setDate(today.getDate() + 30);
        ultimoDia.setHours(0, 0, 0, 0);

        const days: DayType[] = [];
        const cursor = new Date(today);
        while (cursor.getTime() <= ultimoDia.getTime()) {
            const iso = cursor.toISOString().slice(0, 10); // "YYYY-MM-DD"
            days.push({
                data: iso,
                diaNum: cursor.getDate(),
                diaSemana: cursor.toLocaleDateString("pt-BR", { weekday: "long" }),
                mesNome: cursor.toLocaleDateString("pt-BR", { month: "long" }),
                anoNum: cursor.getFullYear(),
                horarios: horarios.filter((h) => h.data === iso),
            });
            cursor.setDate(cursor.getDate() + 1);
            cursor.setHours(0, 0, 0, 0); // Garante que a hora não avance
        }

        setIntervaloDias(days);
    }, [horarios]);

    useEffect(() => {
        const horaInicio = watch("horaInicio");
        const horaFim = watch("horaFim");
        const duracao = watch("duracaoConsultaMinutos");

        if (horaInicio) {
            const [h, m] = horaInicio.split(":").map(Number);
            if (m % 10 !== 0) {
                const ajustado = `${h.toString().padStart(2, "0")}:${(Math.round(m / 10) * 10).toString().padStart(2, "0")}`;
                setValue("horaInicio", ajustado);
            }
        }
        if (horaFim) {
            const [h, m] = horaFim.split(":").map(Number);
            if (m % 10 !== 0) {
                const ajustado = `${h.toString().padStart(2, "0")}:${(Math.round(m / 10) * 10).toString().padStart(2, "0")}`;
                setValue("horaFim", ajustado);
            }
        }
        if (duracao && duracao > 10 && duracao % 5 !== 0) {
            setValue("duracaoConsultaMinutos", Math.round(duracao / 5) * 5);
        }

    }, [watch("horaInicio"), watch("horaFim"), watch("duracaoConsultaMinutos")]);

    console.log("interaloDias", intervaloDias);


    const onSubmit = (data: HorarioType) => {
        data.id = ((horarios[horarios.length - 1]?.id ?? 0) + 1);
        data.medicoNome = medicos.find((item) => item.id === Number(data.medicoId))?.nome || "";
        data.especialidadeNome = especialidades.find((item) => item.id === Number(data.especialidadeId))?.nome || "";
        if (data.horaInicio && data.horaFim && data.duracaoConsultaMinutos) {
            const [hIniHour, hIniMin] = data.horaInicio.split(":").map(Number);
            const [hFimHour, hFimMin] = data.horaFim.split(":").map(Number);

            const inicio = hIniHour * 60 + hIniMin;
            const fim = hFimHour * 60 + hFimMin;
            const duracao = data.duracaoConsultaMinutos;

            const totalAgendamentos = Math.floor((fim - inicio) / duracao);
            data.quantAgendamentos = totalAgendamentos > 0 ? totalAgendamentos : 0;
            data.agendamentosId = Array.from({ length: data.quantAgendamentos }, (_, i) => {
                const [hIniHour, hIniMin] = data.horaInicio!.split(":").map(Number);
                const minutes = hIniHour * 60 + hIniMin + i * data.duracaoConsultaMinutos!;
                const hour = Math.floor(minutes / 60).toString().padStart(2, "0");
                const min = (minutes % 60).toString().padStart(2, "0");
                return { horario: `${hour}:${min}`, marcado: false };
            });
        } else {
            data.quantAgendamentos = 0;
            data.agendamentosId = [];
        }
        fetch("http://localhost:3000/horarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((newHorario) => {
                setHorarios((prev) => [...prev, newHorario]);
                closeModal();
            })
            .catch((err) => console.error("Erro ao adicionar horário:", err));
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full p-4">
            <Modal modalTitle="Cadastro do horário" showModal={showModal} onClose={closeModal} width="w-[600px]">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 !mt-4 justify-between h-full">
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
                    <InputNormal
                        className="w-full"
                        reference="data"
                        register={register}
                        min={new Date().toISOString().split("T")[0]}
                        max={new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0]}
                        label="Data"
                        placeholder=""
                        type="date"
                        errors={errors}
                        obrigatorio
                    />
                    <InputNormal
                        className="w-full"
                        reference="horaInicio"
                        register={register}
                        label="Hora de início"
                        min="06:00"
                        max={watch("horaFim") ? watch("horaFim") : "19:00"}
                        placeholder=""
                        type="time"
                        errors={errors}
                        obrigatorio
                    />
                    <InputNormal
                        className="w-full"
                        reference="horaFim"
                        register={register}
                        label="Hora de fim"
                        min={watch("horaInicio") ? watch("horaInicio") : "06:00"}
                        max="19:00"
                        placeholder=""
                        type="time"
                        errors={errors}
                        obrigatorio
                    />
                    <InputNormal
                        className="w-full"
                        reference="duracaoConsultaMinutos"
                        register={register}
                        label="Duração da consulta (minutos)"
                        placeholder=""
                        min={10}
                        type="number"
                        errors={errors}
                        obrigatorio
                    />

                    <div className="flex justify-end mt-4">
                        <button className="bg-secondary text-white rounded-md !px-4 !py-2" type="submit">Salvar</button>
                    </div>
                </form>
            </Modal>

            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold text-cinza-text">Horários</h1>
                <button className="bg-secondary text-white rounded-md !px-4 !py-2" type="button" onClick={openModal}>
                    Adicionar horário
                </button>
            </div>

            <div className="flex flex-col !pb-6 gap-6">
                {intervaloDias.map((day) => (
                    <div
                        key={day.data}
                        className="bg-white rounded-md shadow !p-6 flex justify-between"
                    >
                        {/* Cabeçalho do dia */}
                        <div className="flex justify-start gap-1 w-48">
                            <span className="text-[50px] leading-none font-light h-full">{day.diaNum}</span>
                            <div className="flex flex-col gap-0.5 !py-1 justify-start leading-none text-sm text-gray-600 capitalize h-full">
                                <span>
                                    {day.diaSemana}
                                </span>
                                <span>
                                    {day.mesNome} {day.anoNum}
                                </span>
                            </div>
                        </div>

                        {/* Lista de horários */}
                        <div className="flex flex-col grow gap-2 !px-6">
                            {day.horarios.map((h, idx) => {
                                // usa '' ou '--:--' se vier indefinido
                                const inicio = h.horaInicio ?? "--:--";
                                const fim = h.horaFim ?? "--:--";

                                return (
                                    <div
                                        key={h.id ?? idx}            // idx garante chave única mesmo sem id
                                        className="flex items-center justify-start gap-5 text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const total = h.quantAgendamentos ?? 0;
                                                const agendamentos = h.agendamentosId ?? [];
                                                const marcados = agendamentos.filter((ag) => ag && ag.marcado === true).length;
                                                let color = "#22C55E"; // verde
                                                if (marcados > 0 && marcados < total) color = "#F59E0B"; // laranja
                                                if (marcados >= total && total > 0) color = "#EF4444"; // vermelho
                                                return (
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                );
                                            })()}
                                            <span className="font-medium">
                                                {inicio} – {fim}
                                            </span>
                                        </div>
                                        <span className="text-gray-700">{h.medicoNome}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}