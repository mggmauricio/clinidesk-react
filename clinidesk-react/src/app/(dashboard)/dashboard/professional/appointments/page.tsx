"use client";

import { useState, useEffect, useRef } from 'react';
import { AppointmentEvent } from '@/components/calendar/AppointmentCalendar';
import AppointmentModal from '@/components/calendar/AppointmentModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, Clock, X } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import './calendar-styles.css'; // Importar estilos personalizados
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { format, addMinutes, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Dados de exemplo para pacientes
const MOCK_PATIENTS = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Oliveira' },
    { id: '3', name: 'Carlos Santos' },
    { id: '4', name: 'Ana Pereira' },
    { id: '5', name: 'Lucas Ferreira' },
];

// Dados de exemplo para tipos de consulta
const MOCK_APPOINTMENT_TYPES = [
    { id: '1', name: 'Consulta Inicial', color: '#4CAF50' },
    { id: '2', name: 'Retorno', color: '#2196F3' },
    { id: '3', name: 'Emergência', color: '#F44336' },
    { id: '4', name: 'Exame', color: '#9C27B0' },
];

// Dados de exemplo para planos de saúde
const MOCK_HEALTH_PLANS = [
    { id: '1', name: 'Unimed', color: '#00995D' },
    { id: '2', name: 'Amil', color: '#0066CC' },
    { id: '3', name: 'SulAmérica', color: '#FF5722' },
    { id: '4', name: 'Bradesco Saúde', color: '#E91E63' },
    { id: '5', name: 'Particular', color: '#9C27B0' },
];

// Dados de exemplo para consultas
const MOCK_EVENTS: AppointmentEvent[] = [
    // Consultas para hoje
    {
        id: '1',
        title: 'Consulta - João Silva',
        start: new Date(new Date().setHours(9, 0, 0, 0)),
        end: new Date(new Date().setHours(10, 0, 0, 0)),
        backgroundColor: '#4CAF50',
        extendedProps: {
            patientId: '1',
            patientName: 'João Silva',
            status: 'confirmed',
            notes: 'Primeira consulta - Avaliação inicial',
            type: '1',
            healthPlan: MOCK_HEALTH_PLANS[0], // Unimed
            isPrivate: false
        }
    },
    {
        id: '2',
        title: 'Consulta - Maria Oliveira',
        start: new Date(new Date().setHours(11, 0, 0, 0)),
        end: new Date(new Date().setHours(12, 0, 0, 0)),
        backgroundColor: '#2196F3',
        extendedProps: {
            patientId: '2',
            patientName: 'Maria Oliveira',
            status: 'pending',
            notes: 'Retorno para avaliação de exames',
            type: '2',
            healthPlan: MOCK_HEALTH_PLANS[1], // Amil
            isPrivate: false
        }
    },
    {
        id: '3',
        title: 'Consulta - Ana Pereira',
        start: new Date(new Date().setHours(14, 0, 0, 0)),
        end: new Date(new Date().setHours(15, 0, 0, 0)),
        backgroundColor: '#9C27B0',
        extendedProps: {
            patientId: '4',
            patientName: 'Ana Pereira',
            status: 'completed',
            notes: 'Exame de rotina realizado com sucesso',
            type: '4',
            isPrivate: true // Consulta particular
        }
    },
    {
        id: '4',
        title: 'Consulta - Lucas Ferreira',
        start: new Date(new Date().setHours(16, 30, 0, 0)),
        end: new Date(new Date().setHours(17, 30, 0, 0)),
        backgroundColor: '#4CAF50',
        extendedProps: {
            patientId: '5',
            patientName: 'Lucas Ferreira',
            status: 'confirmed',
            notes: 'Consulta de rotina',
            type: '1',
            healthPlan: MOCK_HEALTH_PLANS[3], // Bradesco Saúde
            isPrivate: false
        }
    },

    // Consultas para amanhã
    {
        id: '5',
        title: 'Consulta - Carlos Santos',
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(8, 30, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9, 30, 0, 0)),
        backgroundColor: '#F44336',
        extendedProps: {
            patientId: '3',
            patientName: 'Carlos Santos',
            status: 'cancelled',
            notes: 'Paciente cancelou por motivos pessoais',
            type: '3',
            healthPlan: MOCK_HEALTH_PLANS[2], // SulAmérica
            isPrivate: false
        }
    },
    {
        id: '6',
        title: 'Consulta - Mariana Costa',
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 0, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11, 0, 0, 0)),
        backgroundColor: '#4CAF50',
        extendedProps: {
            patientId: '1',
            patientName: 'Mariana Costa',
            status: 'confirmed',
            notes: 'Primeira consulta',
            type: '1',
            healthPlan: MOCK_HEALTH_PLANS[0], // Unimed
            isPrivate: false
        }
    },
    {
        id: '7',
        title: 'Consulta - Pedro Alves',
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(13, 0, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0)),
        backgroundColor: '#2196F3',
        extendedProps: {
            patientId: '2',
            patientName: 'Pedro Alves',
            status: 'pending',
            notes: 'Avaliação de resultados',
            type: '2',
            healthPlan: MOCK_HEALTH_PLANS[1], // Amil
            isPrivate: false
        }
    },

    // Consultas para depois de amanhã
    {
        id: '8',
        title: 'Consulta - Juliana Lima',
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(9, 0, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(10, 0, 0, 0)),
        backgroundColor: '#9C27B0',
        extendedProps: {
            patientId: '4',
            patientName: 'Juliana Lima',
            status: 'confirmed',
            notes: 'Exame de rotina',
            type: '4',
            healthPlan: MOCK_HEALTH_PLANS[3], // Bradesco Saúde
            isPrivate: false
        }
    },
    {
        id: '9',
        title: 'Consulta - Roberto Dias',
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(11, 0, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(12, 0, 0, 0)),
        backgroundColor: '#4CAF50',
        extendedProps: {
            patientId: '5',
            patientName: 'Roberto Dias',
            status: 'confirmed',
            notes: 'Consulta de rotina',
            type: '1',
            isPrivate: true
        }
    },
    {
        id: '10',
        title: 'Consulta - Fernanda Gomes',
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(15, 0, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(16, 0, 0, 0)),
        backgroundColor: '#F44336',
        extendedProps: {
            patientId: '3',
            patientName: 'Fernanda Gomes',
            status: 'cancelled',
            notes: 'Paciente remarcou para a próxima semana',
            type: '3',
            healthPlan: MOCK_HEALTH_PLANS[2], // SulAmérica
            isPrivate: false
        }
    },

    // Consultas para a próxima semana
    {
        id: '11',
        title: 'Consulta - Ricardo Souza',
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 7)).setHours(10, 0, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 7)).setHours(11, 0, 0, 0)),
        backgroundColor: '#2196F3',
        extendedProps: {
            patientId: '2',
            patientName: 'Ricardo Souza',
            status: 'pending',
            notes: 'Retorno para avaliação',
            type: '2',
            healthPlan: MOCK_HEALTH_PLANS[1], // Amil
            isPrivate: false
        }
    },
    {
        id: '12',
        title: 'Consulta - Camila Rocha',
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 7)).setHours(14, 0, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 7)).setHours(15, 0, 0, 0)),
        backgroundColor: '#9C27B0',
        extendedProps: {
            patientId: '4',
            patientName: 'Camila Rocha',
            status: 'confirmed',
            notes: 'Exame de rotina',
            type: '4',
            healthPlan: MOCK_HEALTH_PLANS[4], // Particular
            isPrivate: true
        }
    }
];

export default function ProfessionalAppointmentsPage() {
    // Estado para os eventos do calendário
    const [events, setEvents] = useState<AppointmentEvent[]>(() => {
        // Garantir que as datas sejam processadas corretamente
        return MOCK_EVENTS.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
        }));
    });

    // Estado para o modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentEvent | null>(null);
    const [isNewAppointment, setIsNewAppointment] = useState(false);

    // Estado para a altura do calendário
    const [calendarHeight, setCalendarHeight] = useState<number>(0);

    // Estado para a visualização atual
    const [currentView, setCurrentView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridWeek');

    // Referência para o componente FullCalendar
    const calendarRef = useRef<any>(null);

    // Estado para estatísticas
    const [stats, setStats] = useState({
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        completed: 0,
        today: 0,
        healthPlans: {} as Record<string, number>,
        private: 0
    });

    // Estado para as horas de trabalho
    const [workHours, setWorkHours] = useState({
        startTime: '08:00',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5] // Segunda a sexta por padrão
    });

    // Estado para o modal de configuração de horário
    const [isWorkHoursModalOpen, setIsWorkHoursModalOpen] = useState(false);
    const [tempWorkHours, setTempWorkHours] = useState({
        startTime: '08:00',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5] // Segunda a sexta por padrão
    });

    // Ajustar a altura do calendário com base na altura da janela
    useEffect(() => {
        const updateHeight = () => {
            // Altura da janela menos um valor para margens e outros elementos
            setCalendarHeight(window.innerHeight - 350); // Ajustado para considerar os cards de estatísticas
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    // Calcular estatísticas
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const total = events.length;
        const confirmed = events.filter(e => e.extendedProps?.status === 'confirmed').length;
        const pending = events.filter(e => e.extendedProps?.status === 'pending').length;
        const cancelled = events.filter(e => e.extendedProps?.status === 'cancelled').length;
        const completed = events.filter(e => e.extendedProps?.status === 'completed').length;
        const todayEvents = events.filter(e => {
            const eventDate = new Date(e.start);
            return eventDate >= today && eventDate < tomorrow;
        }).length;

        // Contagem de consultas por plano de saúde
        const healthPlansCount: Record<string, number> = {};
        let privateCount = 0;

        events.forEach(event => {
            if (event.extendedProps?.isPrivate) {
                privateCount++;
            } else if (event.extendedProps?.healthPlan) {
                const planName = event.extendedProps.healthPlan.name;
                healthPlansCount[planName] = (healthPlansCount[planName] || 0) + 1;
            }
        });

        setStats({
            total,
            confirmed,
            pending,
            cancelled,
            completed,
            today: todayEvents,
            healthPlans: healthPlansCount,
            private: privateCount
        });
    }, [events]);

    // Abrir modal para nova consulta
    const handleAddAppointment = () => {
        setSelectedAppointment(null);
        setIsNewAppointment(true);
        setIsModalOpen(true);
    };

    // Abrir modal para editar consulta existente
    const handleEventClick = (event: any) => {
        // Encontrar o evento completo com base no ID
        const selectedEvent = events.find(e => e.id === event.id);
        if (selectedEvent) {
            setSelectedAppointment(selectedEvent);
            setIsNewAppointment(false);
            setIsModalOpen(true);
        }
    };

    // Abrir modal para nova consulta em data selecionada
    const handleDateSelect = (info: any) => {
        const newAppointment: AppointmentEvent = {
            id: `new-${Date.now()}`,
            title: '',
            start: info.startStr,
            end: info.endStr,
            backgroundColor: '#3788d8',
            extendedProps: {
                patientId: '',
                patientName: '',
                status: 'pending',
                notes: '',
                type: ''
            }
        };

        setSelectedAppointment(newAppointment);
        setIsNewAppointment(true);
        setIsModalOpen(true);
    };

    // Atualizar consulta após arrastar e soltar
    const handleEventDrop = (info: any) => {
        const updatedEvents = events.map(event => {
            if (event.id === info.event.id) {
                return {
                    ...event,
                    start: info.event.start,
                    end: info.event.end
                };
            }
            return event;
        });

        setEvents(updatedEvents);
    };

    // Atualizar consulta após redimensionar
    const handleEventResize = (info: any) => {
        const updatedEvents = events.map(event => {
            if (event.id === info.event.id) {
                return {
                    ...event,
                    start: info.event.start,
                    end: info.event.end
                };
            }
            return event;
        });

        setEvents(updatedEvents);
    };

    // Salvar consulta (nova ou editada)
    const handleSaveAppointment = (appointment: AppointmentEvent) => {
        if (appointment.id.startsWith('new-')) {
            // Nova consulta
            const newAppointment = {
                ...appointment,
                id: `appointment-${Date.now()}`
            };
            setEvents([...events, newAppointment]);
        } else {
            // Editar consulta existente
            const updatedEvents = events.map(event => {
                if (event.id === appointment.id) {
                    return appointment;
                }
                return event;
            });
            setEvents(updatedEvents);
        }
    };

    // Excluir consulta
    const handleDeleteAppointment = (appointmentId: string) => {
        const updatedEvents = events.filter(event => event.id !== appointmentId);
        setEvents(updatedEvents);
    };

    // Personalizar os botões de visualização
    const customButtons = {
        dayView: {
            text: 'Dia',
            click: () => {
                setCurrentView('timeGridDay');
                if (calendarRef.current) {
                    const calendarApi = calendarRef.current.getApi();
                    calendarApi.changeView('timeGridDay');
                    // Mostrar labels a cada meia hora na visualização de dia
                    calendarApi.setOption('slotLabelInterval', '00:30:00');
                    calendarApi.setOption('slotLabelFormat', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                }
            }
        },
        weekView: {
            text: 'Semana',
            click: () => {
                setCurrentView('timeGridWeek');
                if (calendarRef.current) {
                    const calendarApi = calendarRef.current.getApi();
                    calendarApi.changeView('timeGridWeek');
                    // Mostrar labels a cada hora na visualização de semana
                    calendarApi.setOption('slotLabelInterval', '01:00:00');
                    calendarApi.setOption('slotLabelFormat', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                }
            }
        },
        monthView: {
            text: 'Mês',
            click: () => {
                setCurrentView('dayGridMonth');
                if (calendarRef.current) {
                    calendarRef.current.getApi().changeView('dayGridMonth');
                }
            }
        }
    };

    // Configurar as opções iniciais com base na visualização atual
    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();

            if (currentView === 'timeGridDay') {
                // Mostrar labels a cada meia hora na visualização de dia
                calendarApi.setOption('slotLabelInterval', '00:30:00');
            } else if (currentView === 'timeGridWeek') {
                // Mostrar labels a cada hora na visualização de semana
                calendarApi.setOption('slotLabelInterval', '01:00:00');
            }
        }
    }, [currentView]);

    const eventContent = (arg: any) => {
        const { status, healthPlan, isPrivate } = arg.event.extendedProps;

        // Definir ícone com base no status
        let statusIcon = null;
        if (status === 'confirmed') {
            statusIcon = <div className="status-icon confirmed">✓</div>;
        } else if (status === 'pending') {
            statusIcon = <div className="status-icon pending">⌛</div>;
        } else if (status === 'cancelled') {
            statusIcon = <div className="status-icon cancelled">✕</div>;
        } else if (status === 'completed') {
            statusIcon = <div className="status-icon completed">✓✓</div>;
        }

        // Determinar a cor do plano de saúde
        let healthPlanColor = '#9C27B0'; // Cor padrão para consultas particulares
        if (healthPlan && !isPrivate) {
            healthPlanColor = healthPlan.color;
        }

        return (
            <div className={`event-${status}`} style={{ height: '100%', width: '100%', position: 'relative' }}>
                {/* Linha colorida do plano de saúde */}
                <div
                    className="health-plan-indicator"
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: healthPlanColor,
                        borderTopLeftRadius: '4px',
                        borderBottomLeftRadius: '4px'
                    }}
                />
                <div className="fc-event-main-content" style={{ paddingLeft: '6px' }}>
                    <div className="fc-event-title">
                        {arg.event.title}
                    </div>
                    <div className="fc-event-time">
                        {arg.timeText}
                    </div>
                </div>
                {statusIcon}
            </div>
        );
    };

    // Função para atualizar as horas de trabalho
    const updateWorkHours = () => {
        // Validar formato de hora (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

        if (!timeRegex.test(tempWorkHours.startTime) || !timeRegex.test(tempWorkHours.endTime)) {
            toast.error("Formato de hora inválido", {
                description: "Por favor, use o formato 24h (HH:MM)"
            });
            return;
        }

        // Garantir que o formato está em 24h (HH:MM)
        const formatTime = (time: string) => {
            const [hours, minutes] = time.split(':');
            return `${hours.padStart(2, '0')}:${minutes}`;
        };

        const formattedStartTime = formatTime(tempWorkHours.startTime);
        const formattedEndTime = formatTime(tempWorkHours.endTime);

        setWorkHours({
            ...tempWorkHours,
            startTime: formattedStartTime,
            endTime: formattedEndTime
        });

        toast.success("Horário de trabalho atualizado", {
            description: `Horário definido: ${formattedStartTime} às ${formattedEndTime}`
        });

        setIsWorkHoursModalOpen(false);
    };

    // Função para alternar dias da semana
    const toggleDay = (day: number) => {
        setTempWorkHours(prev => {
            const newDays = [...prev.daysOfWeek];
            if (newDays.includes(day)) {
                return { ...prev, daysOfWeek: newDays.filter(d => d !== day) };
            } else {
                return { ...prev, daysOfWeek: [...newDays, day].sort() };
            }
        });
    };

    // Inicializar tempWorkHours quando o modal é aberto
    useEffect(() => {
        if (isWorkHoursModalOpen) {
            setTempWorkHours(workHours);
        }
    }, [isWorkHoursModalOpen, workHours]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Minha Agenda</h1>
                <div className="flex gap-2">
                    <Button onClick={handleAddAppointment}>
                        <Plus className="mr-2 h-4 w-4" /> Nova Consulta
                    </Button>
                    <Button variant="outline" onClick={() => setIsWorkHoursModalOpen(true)}>
                        <Clock className="mr-2 h-4 w-4" /> Horário de Trabalho
                    </Button>
                </div>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Consultas Hoje</p>
                            <p className="text-3xl font-bold">{stats.today}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-primary opacity-80" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Confirmadas</p>
                            <p className="text-3xl font-bold">{stats.confirmed}</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full bg-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Pendentes</p>
                            <p className="text-3xl font-bold">{stats.pending}</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full bg-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total de Pacientes</p>
                            <p className="text-3xl font-bold">{MOCK_PATIENTS.length}</p>
                        </div>
                        <Users className="h-8 w-8 text-primary opacity-80" />
                    </CardContent>
                </Card>
            </div>

            {/* Badges de planos de saúde */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground">Planos de Saúde:</span>
                {Object.entries(stats.healthPlans).map(([planName, count]) => {
                    const plan = MOCK_HEALTH_PLANS.find(p => p.name === planName);
                    return (
                        <div
                            key={planName}
                            className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                            style={{
                                backgroundColor: plan ? `${plan.color}20` : '#e5e7eb',
                                color: plan ? plan.color : 'var(--foreground)'
                            }}
                        >
                            <span>{planName}</span>
                            <span className="bg-background/80 px-1.5 py-0.5 rounded-full">{count}</span>
                        </div>
                    );
                })}
                {stats.private > 0 && (
                    <div
                        className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{
                            backgroundColor: '#9C27B020',
                            color: '#9C27B0'
                        }}
                    >
                        <span>Particular</span>
                        <span className="bg-background/80 px-1.5 py-0.5 rounded-full">{stats.private}</span>
                    </div>
                )}
            </div>

            {/* Calendário */}
            <Card className="shadow-sm border border-border/10">
                <CardContent className="p-0">
                    <div className="p-2 pt-3 custom-calendar-container">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView={currentView}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayView,weekView,monthView'
                            }}
                            customButtons={customButtons}
                            locale={ptBrLocale}
                            events={events}
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={workHours.daysOfWeek.includes(0) || workHours.daysOfWeek.includes(6)}
                            height={calendarHeight || 'auto'}
                            businessHours={[
                                {
                                    daysOfWeek: workHours.daysOfWeek,
                                    startTime: workHours.startTime,
                                    endTime: workHours.endTime
                                }
                            ]}
                            eventClick={(info) => {
                                handleEventClick(info.event);
                            }}
                            select={handleDateSelect}
                            eventDrop={handleEventDrop}
                            eventResize={handleEventResize}
                            slotMinTime={workHours.startTime}
                            slotMaxTime={workHours.endTime}
                            allDaySlot={false}
                            slotDuration="00:30:00"
                            slotLabelInterval={currentView === 'timeGridDay' ? '00:30:00' : '01:00:00'}
                            slotLabelFormat={
                                currentView === 'timeGridDay'
                                    ? {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    }
                                    : {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    }
                            }
                            slotEventOverlap={false}
                            eventMinHeight={0}
                            displayEventTime={true}
                            displayEventEnd={true}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                meridiem: false,
                                hour12: false
                            }}
                            nowIndicator={true}
                            eventContent={eventContent}
                            eventClassNames={(arg) => {
                                const status = arg.event.extendedProps?.status || 'pending';
                                return [`event-${status}`];
                            }}
                            forceEventDuration={true}
                            eventDurationEditable={true}
                            eventResizableFromStart={true}
                            expandRows={true}
                            stickyHeaderDates={true}
                            fixedWeekCount={false}
                            timeZone="local"
                            snapDuration="00:30:00"
                            scrollTime={workHours.startTime}
                            firstDay={0}
                            dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Modal para criar/editar consultas */}
            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appointment={selectedAppointment}
                isNew={isNewAppointment}
                onSave={handleSaveAppointment}
                onDelete={handleDeleteAppointment}
                patients={MOCK_PATIENTS}
                appointmentTypes={MOCK_APPOINTMENT_TYPES}
                healthPlans={MOCK_HEALTH_PLANS}
            />

            {/* Modal para configurar horas de trabalho */}
            <Dialog open={isWorkHoursModalOpen} onOpenChange={setIsWorkHoursModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Configurar Horário de Trabalho</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Horário de Início</Label>
                                <div className="relative">
                                    <select
                                        id="startTime"
                                        value={tempWorkHours.startTime}
                                        onChange={(e) => setTempWorkHours({ ...tempWorkHours, startTime: e.target.value })}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {Array.from({ length: 24 }, (_, hour) => (
                                            [0, 15, 30, 45].map(minute => {
                                                const formattedHour = hour.toString().padStart(2, '0');
                                                const formattedMinute = minute.toString().padStart(2, '0');
                                                const timeValue = `${formattedHour}:${formattedMinute}`;
                                                return (
                                                    <option key={timeValue} value={timeValue}>
                                                        {timeValue}
                                                    </option>
                                                );
                                            })
                                        )).flat()}
                                    </select>
                                </div>
                                <p className="text-xs text-muted-foreground">Formato 24h (ex: 07:00)</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime">Horário de Término</Label>
                                <div className="relative">
                                    <select
                                        id="endTime"
                                        value={tempWorkHours.endTime}
                                        onChange={(e) => setTempWorkHours({ ...tempWorkHours, endTime: e.target.value })}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {Array.from({ length: 24 }, (_, hour) => (
                                            [0, 15, 30, 45].map(minute => {
                                                const formattedHour = hour.toString().padStart(2, '0');
                                                const formattedMinute = minute.toString().padStart(2, '0');
                                                const timeValue = `${formattedHour}:${formattedMinute}`;
                                                return (
                                                    <option key={timeValue} value={timeValue}>
                                                        {timeValue}
                                                    </option>
                                                );
                                            })
                                        )).flat()}
                                    </select>
                                </div>
                                <p className="text-xs text-muted-foreground">Formato 24h (ex: 19:00)</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Dias de Trabalho</Label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { day: 0, label: 'Dom' },
                                    { day: 1, label: 'Seg' },
                                    { day: 2, label: 'Ter' },
                                    { day: 3, label: 'Qua' },
                                    { day: 4, label: 'Qui' },
                                    { day: 5, label: 'Sex' },
                                    { day: 6, label: 'Sáb' }
                                ].map(({ day, label }) => (
                                    <div key={day} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`day-${day}`}
                                            checked={tempWorkHours.daysOfWeek.includes(day)}
                                            onCheckedChange={() => toggleDay(day)}
                                        />
                                        <label
                                            htmlFor={`day-${day}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsWorkHoursModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={updateWorkHours}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 