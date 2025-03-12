"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Card, CardContent } from '@/components/ui/card';

// Tipos para os eventos
export interface AppointmentEvent {
    id: string;
    title: string;
    start: Date | string;
    end: Date | string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps?: {
        patientId?: string;
        patientName?: string;
        status?: 'confirmed' | 'pending' | 'cancelled' | 'completed';
        notes?: string;
        type?: string;
        healthPlan?: {
            id: string;
            name: string;
            color?: string;
        };
        isPrivate?: boolean; // Indica se é consulta particular
    };
}

export interface AppointmentCalendarProps {
    events: AppointmentEvent[];
    onEventClick?: (event: AppointmentEvent) => void;
    onDateSelect?: (start: Date, end: Date) => void;
    onEventDrop?: (event: AppointmentEvent, delta: any) => void;
    onEventResize?: (event: AppointmentEvent, delta: any) => void;
    editable?: boolean;
    selectable?: boolean;
    initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
    headerToolbar?: {
        left?: string;
        center?: string;
        right?: string;
    };
    businessHours?: {
        daysOfWeek: number[];
        startTime: string;
        endTime: string;
    };
    eventContent?: (arg: any) => React.ReactNode;
}

export default function AppointmentCalendar({
    events,
    onEventClick,
    onDateSelect,
    onEventDrop,
    onEventResize,
    editable = false,
    selectable = false,
    initialView = 'timeGridWeek',
    headerToolbar = {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    businessHours = {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '08:00',
        endTime: '18:00'
    },
    eventContent
}: AppointmentCalendarProps) {
    // Estado para controlar a altura do calendário
    const [calendarHeight, setCalendarHeight] = useState<number>(0);

    // Ajustar a altura do calendário com base na altura da janela
    useEffect(() => {
        const updateHeight = () => {
            // Altura da janela menos um valor para margens e outros elementos
            setCalendarHeight(window.innerHeight - 200);
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    // Função para lidar com cliques em eventos
    const handleEventClick = (info: any) => {
        if (onEventClick) {
            onEventClick(info.event as AppointmentEvent);
        }
    };

    // Função para lidar com seleção de datas
    const handleDateSelect = (info: any) => {
        if (onDateSelect) {
            onDateSelect(info.start, info.end);
        }
    };

    // Função para lidar com arrastar e soltar eventos
    const handleEventDrop = (info: any) => {
        if (onEventDrop) {
            onEventDrop(info.event as AppointmentEvent, info.delta);
        }
    };

    // Função para lidar com redimensionamento de eventos
    const handleEventResize = (info: any) => {
        if (onEventResize) {
            onEventResize(info.event as AppointmentEvent, info.delta);
        }
    };

    return (
        <Card className="shadow-md border border-border/20">
            <CardContent className="p-0">
                <div className="p-4">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView={initialView}
                        headerToolbar={headerToolbar}
                        locale={ptBrLocale}
                        events={events}
                        editable={editable}
                        selectable={selectable}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        height={calendarHeight || 'auto'}
                        businessHours={businessHours}
                        eventClick={handleEventClick}
                        select={handleDateSelect}
                        eventDrop={handleEventDrop}
                        eventResize={handleEventResize}
                        slotMinTime="07:00:00"
                        slotMaxTime="20:00:00"
                        allDaySlot={false}
                        slotDuration="00:30:00"
                        slotLabelInterval="01:00"
                        slotLabelFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            omitZeroMinute: false,
                            meridiem: 'short'
                        }}
                        eventTimeFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            meridiem: 'short'
                        }}
                        nowIndicator={true}
                        eventContent={eventContent}
                        eventClassNames={(arg) => {
                            const status = arg.event.extendedProps?.status || 'pending';
                            return [`event-${status}`];
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
} 