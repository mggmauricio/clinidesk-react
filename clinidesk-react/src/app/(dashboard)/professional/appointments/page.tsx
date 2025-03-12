"use client";

import { useState, useEffect } from 'react';
import AppointmentCalendar, { AppointmentEvent } from '@/components/calendar/AppointmentCalendar';
import AppointmentModal from '@/components/calendar/AppointmentModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, Users } from 'lucide-react';

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

// Dados de exemplo para consultas
const MOCK_EVENTS: AppointmentEvent[] = [
    {
        id: '1',
        title: 'Consulta - João Silva',
        start: new Date(new Date().setHours(10, 0, 0, 0)),
        end: new Date(new Date().setHours(11, 0, 0, 0)),
        backgroundColor: '#4CAF50',
        extendedProps: {
            patientId: '1',
            patientName: 'João Silva',
            status: 'confirmed',
            notes: 'Primeira consulta',
            type: '1'
        }
    },
    {
        id: '2',
        title: 'Consulta - Maria Oliveira',
        start: new Date(new Date().setHours(14, 0, 0, 0)),
        end: new Date(new Date().setHours(15, 0, 0, 0)),
        backgroundColor: '#2196F3',
        extendedProps: {
            patientId: '2',
            patientName: 'Maria Oliveira',
            status: 'pending',
            notes: 'Retorno para avaliação',
            type: '2'
        }
    },
    {
        id: '3',
        title: 'Consulta - Carlos Santos',
        start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9, 0, 0, 0)),
        end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 0, 0, 0)),
        backgroundColor: '#F44336',
        extendedProps: {
            patientId: '3',
            patientName: 'Carlos Santos',
            status: 'cancelled',
            notes: 'Emergência',
            type: '3'
        }
    }
];

export default function ProfessionalAppointmentsPage() {
    // Estado para os eventos do calendário
    const [events, setEvents] = useState<AppointmentEvent[]>(MOCK_EVENTS);

    // Estado para o modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentEvent | null>(null);
    const [isNewAppointment, setIsNewAppointment] = useState(false);

    // Estado para estatísticas
    const [stats, setStats] = useState({
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        completed: 0,
        today: 0
    });

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

        setStats({
            total,
            confirmed,
            pending,
            cancelled,
            completed,
            today: todayEvents
        });
    }, [events]);

    // Abrir modal para nova consulta
    const handleAddAppointment = () => {
        setSelectedAppointment(null);
        setIsNewAppointment(true);
        setIsModalOpen(true);
    };

    // Abrir modal para editar consulta existente
    const handleEventClick = (info: any) => {
        const appointment = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            backgroundColor: info.event.backgroundColor,
            borderColor: info.event.borderColor,
            textColor: info.event.textColor,
            extendedProps: info.event.extendedProps
        };

        setSelectedAppointment(appointment);
        setIsNewAppointment(false);
        setIsModalOpen(true);
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Minha Agenda</h1>
                <Button onClick={handleAddAppointment}>
                    <Plus className="mr-2 h-4 w-4" /> Nova Consulta
                </Button>
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

            {/* Tabs para diferentes visualizações */}
            <Tabs defaultValue="week">
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="day">Dia</TabsTrigger>
                        <TabsTrigger value="week">Semana</TabsTrigger>
                        <TabsTrigger value="month">Mês</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="day" className="mt-0">
                    <AppointmentCalendar
                        events={events}
                        onEventClick={handleEventClick}
                        onDateSelect={handleDateSelect}
                        onEventDrop={handleEventDrop}
                        onEventResize={handleEventResize}
                        initialView="timeGridDay"
                    />
                </TabsContent>

                <TabsContent value="week" className="mt-0">
                    <AppointmentCalendar
                        events={events}
                        onEventClick={handleEventClick}
                        onDateSelect={handleDateSelect}
                        onEventDrop={handleEventDrop}
                        onEventResize={handleEventResize}
                        initialView="timeGridWeek"
                    />
                </TabsContent>

                <TabsContent value="month" className="mt-0">
                    <AppointmentCalendar
                        events={events}
                        onEventClick={handleEventClick}
                        onDateSelect={handleDateSelect}
                        onEventDrop={handleEventDrop}
                        onEventResize={handleEventResize}
                        initialView="dayGridMonth"
                    />
                </TabsContent>
            </Tabs>

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
            />
        </div>
    );
} 