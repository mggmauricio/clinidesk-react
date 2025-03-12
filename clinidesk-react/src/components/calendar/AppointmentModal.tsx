"use client";

import { useState, useEffect } from 'react';
import { format, addMinutes, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AppointmentEvent } from './AppointmentCalendar';
import { Calendar, Clock, User, FileText, Tag } from 'lucide-react';

// Duração das consultas em minutos
const DURATION_OPTIONS = [
    { value: 15, label: '15 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1 hora e 30 minutos' },
    { value: 120, label: '2 horas' }
];

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment?: AppointmentEvent | null;
    isNew?: boolean;
    onSave?: (appointment: AppointmentEvent) => void;
    onDelete?: (appointmentId: string) => void;
    patients?: { id: string; name: string }[];
    appointmentTypes?: { id: string; name: string; color: string }[];
    healthPlans?: { id: string; name: string; color: string }[];
}

export default function AppointmentModal({
    isOpen,
    onClose,
    appointment,
    isNew = false,
    onSave,
    onDelete,
    patients = [],
    appointmentTypes = [],
    healthPlans = []
}: AppointmentModalProps) {
    // Estado para o formulário
    const [formData, setFormData] = useState<Partial<AppointmentEvent>>({
        id: '',
        title: '',
        start: '',
        end: '',
        backgroundColor: '#3788d8',
        extendedProps: {
            patientId: '',
            patientName: '',
            status: 'pending',
            notes: '',
            type: '',
            healthPlan: undefined,
            isPrivate: false
        }
    });

    // Estados para o datepicker e timepicker
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>('09:00');
    const [selectedDuration, setSelectedDuration] = useState<number>(30);

    // Atualizar o formulário quando o appointment mudar
    useEffect(() => {
        if (appointment) {
            setFormData({
                ...appointment,
                extendedProps: {
                    ...appointment.extendedProps
                }
            });

            // Configurar data e hora
            if (appointment.start) {
                const startDate = new Date(appointment.start);
                setSelectedDate(startDate);
                setSelectedTime(format(startDate, 'HH:mm'));

                // Calcular duração
                if (appointment.end) {
                    const endDate = new Date(appointment.end);
                    const durationMs = endDate.getTime() - startDate.getTime();
                    const durationMinutes = Math.round(durationMs / (1000 * 60));

                    // Encontrar a opção de duração mais próxima
                    const closestDuration = DURATION_OPTIONS.reduce((prev, curr) => {
                        return Math.abs(curr.value - durationMinutes) < Math.abs(prev.value - durationMinutes) ? curr : prev;
                    });

                    setSelectedDuration(closestDuration.value);
                }
            }
        } else if (isNew) {
            // Resetar o formulário para uma nova consulta
            const now = new Date();
            const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
            const roundedTime = new Date(now);
            roundedTime.setMinutes(roundedMinutes);
            roundedTime.setSeconds(0);
            roundedTime.setMilliseconds(0);

            setSelectedDate(roundedTime);
            setSelectedTime(format(roundedTime, 'HH:mm'));
            setSelectedDuration(30);

            setFormData({
                id: `new-${Date.now()}`,
                title: '',
                start: roundedTime,
                end: addMinutes(roundedTime, 30),
                backgroundColor: '#3788d8',
                extendedProps: {
                    patientId: '',
                    patientName: '',
                    status: 'pending',
                    notes: '',
                    type: '',
                    healthPlan: undefined,
                    isPrivate: false
                }
            });
        }
    }, [appointment, isNew]);

    // Atualizar datas quando o usuário selecionar data, hora ou duração
    useEffect(() => {
        if (selectedDate && selectedTime) {
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const startDate = new Date(selectedDate);
            startDate.setHours(hours, minutes, 0, 0);

            const endDate = addMinutes(startDate, selectedDuration);

            setFormData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    start: startDate,
                    end: endDate
                };
            });
        }
    }, [selectedDate, selectedTime, selectedDuration]);

    // Manipular mudanças nos campos do formulário
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent as keyof typeof prev],
                        [child]: value
                    }
                };
            });
        } else {
            setFormData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    [name]: value
                };
            });
        }
    };

    // Manipular mudanças nos selects
    const handleSelectChange = (name: string, value: string) => {
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => {
                if (!prev) return prev;

                if (child === 'patientId') {
                    const patient = patients.find(p => p.id === value);
                    if (patient) {
                        return {
                            ...prev,
                            title: `Consulta - ${patient.name}`,
                            extendedProps: {
                                ...prev.extendedProps,
                                patientId: value,
                                patientName: patient.name
                            }
                        };
                    }
                }

                if (child === 'type') {
                    const appointmentType = appointmentTypes.find(t => t.id === value);
                    if (appointmentType) {
                        return {
                            ...prev,
                            backgroundColor: appointmentType.color,
                            extendedProps: {
                                ...prev.extendedProps,
                                type: value
                            }
                        };
                    }
                }

                if (child === 'healthPlanId') {
                    if (value === 'private') {
                        return {
                            ...prev,
                            extendedProps: {
                                ...prev.extendedProps,
                                healthPlan: undefined,
                                isPrivate: true
                            }
                        };
                    } else {
                        const healthPlan = healthPlans.find(p => p.id === value);
                        if (healthPlan) {
                            return {
                                ...prev,
                                extendedProps: {
                                    ...prev.extendedProps,
                                    healthPlan,
                                    isPrivate: false
                                }
                            };
                        }
                    }
                }

                if (child === 'status') {
                    return {
                        ...prev,
                        extendedProps: {
                            ...prev.extendedProps,
                            status: value
                        }
                    };
                }

                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent as keyof typeof prev],
                        [child]: value
                    }
                };
            });
        } else {
            setFormData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    [name]: value
                };
            });
        }
    };

    // Salvar a consulta
    const handleSave = () => {
        if (onSave && formData.title && formData.start && formData.end) {
            onSave(formData as AppointmentEvent);
            onClose();
        }
    };

    // Excluir a consulta
    const handleDelete = () => {
        if (onDelete && formData.id) {
            onDelete(formData.id);
            onClose();
        }
    };

    // Formatar datas para exibição
    const formatDate = (date: Date | string) => {
        if (!date) return '';
        return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    };

    // Formatar hora para exibição
    const formatTime = (date: Date | string) => {
        if (!date) return '';
        return format(new Date(date), "HH:mm", { locale: ptBR });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isNew ? 'Nova Consulta' : 'Detalhes da Consulta'}
                    </DialogTitle>
                    <DialogDescription>
                        {isNew
                            ? 'Preencha os detalhes para agendar uma nova consulta'
                            : 'Visualize ou edite os detalhes da consulta'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Título da consulta */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Título
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>

                    {/* Paciente */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="patient" className="text-right flex items-center justify-end gap-2">
                            <User className="h-4 w-4" /> Paciente
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.extendedProps?.patientId || ''}
                                onValueChange={(value) => handleSelectChange('extendedProps.patientId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um paciente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map((patient) => (
                                        <SelectItem key={patient.id} value={patient.id}>
                                            {patient.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Data */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right flex items-center justify-end gap-2">
                            <Calendar className="h-4 w-4" /> Data
                        </Label>
                        <div className="col-span-3">
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="date"
                                    value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            setSelectedDate(new Date(e.target.value));
                                        }
                                    }}
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {selectedDate ? formatDate(selectedDate) : "Selecione uma data"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hora */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right flex items-center justify-end gap-2">
                            <Clock className="h-4 w-4" /> Hora
                        </Label>
                        <div className="col-span-3">
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="time"
                                    value={selectedTime}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            setSelectedTime(e.target.value);
                                        }
                                    }}
                                    className="w-full"
                                    step="900" // 15 minutos em segundos
                                />
                                <p className="text-xs text-muted-foreground">
                                    Formato 24h (ex: 09:00, 14:30)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Duração */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right flex items-center justify-end gap-2">
                            <Clock className="h-4 w-4" /> Duração
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={selectedDuration.toString()}
                                onValueChange={(value) => setSelectedDuration(parseInt(value))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione a duração" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DURATION_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value.toString()}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Resumo do agendamento */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            Resumo
                        </Label>
                        <div className="col-span-3 text-sm">
                            {selectedDate && selectedTime ? (
                                <div className="p-2 bg-muted rounded-md">
                                    <p>
                                        <span className="font-medium">Data:</span> {formatDate(selectedDate)}
                                    </p>
                                    <p>
                                        <span className="font-medium">Horário:</span> {selectedTime} às {
                                            format(
                                                addMinutes(
                                                    parse(selectedTime, 'HH:mm', new Date()),
                                                    selectedDuration
                                                ),
                                                'HH:mm'
                                            )
                                        }
                                    </p>
                                    <p>
                                        <span className="font-medium">Duração:</span> {DURATION_OPTIONS.find(opt => opt.value === selectedDuration)?.label}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Selecione data e hora para ver o resumo</p>
                            )}
                        </div>
                    </div>

                    {/* Tipo de consulta */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right flex items-center justify-end gap-2">
                            <Tag className="h-4 w-4" /> Tipo
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.extendedProps?.type || ''}
                                onValueChange={(value) => handleSelectChange('extendedProps.type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {appointmentTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: type.color }}
                                                />
                                                {type.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Plano de Saúde */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="healthPlan" className="text-right flex items-center justify-end gap-2">
                            <FileText className="h-4 w-4" /> Plano
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.extendedProps?.isPrivate ? 'private' : formData.extendedProps?.healthPlan?.id || ''}
                                onValueChange={(value) => handleSelectChange('extendedProps.healthPlanId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o plano" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="private">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: '#9C27B0' }}
                                            />
                                            Particular
                                        </div>
                                    </SelectItem>
                                    {healthPlans.map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: plan.color }}
                                                />
                                                {plan.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.extendedProps?.status || 'pending'}
                                onValueChange={(value) => handleSelectChange('extendedProps.status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                            Pendente
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="confirmed">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                            Confirmada
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            Cancelada
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                                            Concluída
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Observações */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right flex items-center justify-end gap-2">
                            <FileText className="h-4 w-4" /> Observações
                        </Label>
                        <Textarea
                            id="notes"
                            name="extendedProps.notes"
                            value={formData.extendedProps?.notes || ''}
                            onChange={handleChange}
                            className="col-span-3"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-between">
                    {!isNew && (
                        <Button variant="destructive" onClick={handleDelete}>
                            Excluir
                        </Button>
                    )}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave}>
                            {isNew ? 'Agendar' : 'Salvar'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 