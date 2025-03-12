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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { AppointmentEvent } from './AppointmentCalendar';
import { Calendar as CalendarIcon, Clock, User, FileText, Tag, ChevronDown, Type, FileDigit, AlertCircle } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Duração das consultas em minutos
const DURATION_OPTIONS = [
    { value: 15, label: '15 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1 hora e 30 minutos' },
    { value: 120, label: '2 horas' }
];

// Opções de horários em intervalos de 15 minutos
const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return {
        value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    };
});

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
                    ...(appointment.extendedProps || {})
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
        if (selectedDate) {
            // Se selectedDate já inclui a hora (do DatePicker)
            const startDate = new Date(selectedDate);
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
    }, [selectedDate, selectedDuration]);

    // Função para lidar com a mudança de data e hora no DatePicker
    const handleDateTimeChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(date);
            setSelectedTime(format(date, 'HH:mm'));
        }
    };

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
                        ...(prev[parent as keyof typeof prev] as Record<string, unknown> || {}),
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
                                ...(prev.extendedProps || {}),
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
                                ...(prev.extendedProps || {}),
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
                                ...(prev.extendedProps || {}),
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
                                    ...(prev.extendedProps || {}),
                                    healthPlan,
                                    isPrivate: false
                                }
                            };
                        }
                    }
                }

                if (child === 'status') {
                    // Garantir que o status seja um dos valores permitidos
                    const status = value as 'confirmed' | 'pending' | 'cancelled' | 'completed';
                    return {
                        ...prev,
                        extendedProps: {
                            ...(prev.extendedProps || {}),
                            status
                        }
                    };
                }

                // Fallback para outros campos
                return {
                    ...prev,
                    [parent]: {
                        ...(prev[parent as keyof typeof prev] as Record<string, unknown> || {}),
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
            <DialogContent className="w-[95vw] max-w-[34.375rem] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl">
                        {isNew ? 'Nova Consulta' : 'Detalhes da Consulta'}
                    </DialogTitle>
                    <DialogDescription>
                        {isNew
                            ? 'Preencha os detalhes para agendar uma nova consulta'
                            : 'Visualize ou edite os detalhes da consulta'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-2">
                    {/* Título da consulta */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label htmlFor="title" className="sm:text-right font-medium">
                            <span className="flex items-center sm:justify-end gap-2">
                                <Type className="h-4 w-4" /> Título
                            </span>
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            className="col-span-1 sm:col-span-3"
                        />
                    </div>

                    {/* Paciente */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label htmlFor="patient" className="sm:text-right font-medium">
                            <span className="flex items-center sm:justify-end gap-2">
                                <User className="h-4 w-4" /> Paciente
                            </span>
                        </Label>
                        <div className="col-span-1 sm:col-span-3">
                            <Select
                                value={formData.extendedProps?.patientId || ''}
                                onValueChange={(value) => handleSelectChange('extendedProps.patientId', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um paciente" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[40vh] overflow-y-auto">
                                    {patients.map((patient) => (
                                        <SelectItem key={patient.id} value={patient.id}>
                                            {patient.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Data e Hora */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label className="sm:text-right font-medium">
                            <span className="flex items-center sm:justify-end gap-2">
                                <CalendarIcon className="h-4 w-4" /> Data e Hora
                            </span>
                        </Label>
                        <div className="col-span-1 sm:col-span-3">
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateTimeChange}
                                        locale={ptBR}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        timeCaption="Hora"
                                        placeholderText="Selecione data e hora"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        popperClassName="react-datepicker-popper"
                                        popperPlacement="bottom-start"
                                    />
                                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {selectedDate ? formatDate(selectedDate) : "Selecione data e hora"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Duração */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label className="sm:text-right font-medium">
                            <span className="flex items-center sm:justify-end gap-2">
                                <Clock className="h-4 w-4" /> Duração
                            </span>
                        </Label>
                        <div className="col-span-1 sm:col-span-3">
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
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                        <Label className="sm:text-right font-medium pt-2">
                            <span className="flex items-center sm:justify-end gap-2">
                                <FileDigit className="h-4 w-4" /> Resumo
                            </span>
                        </Label>
                        <div className="col-span-1 sm:col-span-3 text-sm">
                            {selectedDate && selectedTime ? (
                                <div className="p-3 bg-muted rounded-md">
                                    <p className="mb-1">
                                        <span className="font-medium">Data:</span> {formatDate(selectedDate)}
                                    </p>
                                    <p className="mb-1">
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
                                <p className="text-muted-foreground p-3 bg-muted rounded-md">Selecione data e hora para ver o resumo</p>
                            )}
                        </div>
                    </div>

                    {/* Tipo de consulta */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label htmlFor="type" className="sm:text-right font-medium">
                            <span className="flex items-center sm:justify-end gap-2">
                                <Tag className="h-4 w-4" /> Tipo
                            </span>
                        </Label>
                        <div className="col-span-1 sm:col-span-3">
                            <Select
                                value={formData.extendedProps?.type || ''}
                                onValueChange={(value) => handleSelectChange('extendedProps.type', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[40vh] overflow-y-auto">
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
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label htmlFor="healthPlan" className="sm:text-right font-medium">
                            <span className="flex items-center sm:justify-end gap-2">
                                <FileText className="h-4 w-4" /> Plano
                            </span>
                        </Label>
                        <div className="col-span-1 sm:col-span-3">
                            <Select
                                value={formData.extendedProps?.isPrivate ? 'private' : formData.extendedProps?.healthPlan?.id || ''}
                                onValueChange={(value) => handleSelectChange('extendedProps.healthPlanId', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o plano" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[40vh] overflow-y-auto">
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
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                        <Label htmlFor="status" className="sm:text-right font-medium">
                            <span className="flex items-center sm:justify-end gap-2">
                                <AlertCircle className="h-4 w-4" /> Status
                            </span>
                        </Label>
                        <div className="col-span-1 sm:col-span-3">
                            <Select
                                value={formData.extendedProps?.status || 'pending'}
                                onValueChange={(value) => handleSelectChange('extendedProps.status', value)}
                            >
                                <SelectTrigger className="w-full">
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
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                        <Label htmlFor="notes" className="sm:text-right font-medium pt-2">
                            <span className="flex items-center sm:justify-end gap-2">
                                <FileText className="h-4 w-4" /> Observações
                            </span>
                        </Label>
                        <Textarea
                            id="notes"
                            name="extendedProps.notes"
                            value={formData.extendedProps?.notes || ''}
                            onChange={handleChange}
                            className="col-span-1 sm:col-span-3"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row justify-between pt-2 border-t mt-2">
                    {!isNew && (
                        <Button variant="destructive" onClick={handleDelete} className="mb-2 sm:mb-0">
                            Excluir
                        </Button>
                    )}
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
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