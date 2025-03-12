export interface HealthProfessional {
    id: string;
    username: string;
    identification_document: string;
    full_name: string;
    phone_number: string;
    email: string;
    specialization?: string;
    cnae?: string;
    is_independent: boolean;
    birth_date: string;
    bot_phone?: string;
    location_id?: string;
    created_at: string;
    updated_at: string;
}
