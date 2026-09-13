-- ==============================================================================
-- CHECKLIST & DELEGATION MANAGEMENT SYSTEM - DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ORGANIZATIONS (Multi-Tenant Support)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Organization
INSERT INTO public.organizations (id, name, code)
VALUES ('00000000-0000-0000-0000-000000000001', 'Acme Corporate Corp', 'ACME-CORP')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. DEPARTMENTS & DESIGNATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE IF NOT EXISTS public.designations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. PROFILES (Extends Supabase Auth users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(30),
    role VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE' CHECK (role IN ('ADMIN', 'MANAGER', 'EMPLOYEE')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    designation_id UUID REFERENCES public.designations(id) ON DELETE SET NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. MASTER TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.priority_masters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color_code VARCHAR(20) DEFAULT '#3b82f6',
    weight INT DEFAULT 1,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.frequency_masters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    interval_days INT DEFAULT 1
);

INSERT INTO public.frequency_masters (name, description, interval_days) VALUES
('One Time', 'Single instance task', 0),
('Daily', 'Repeats every day', 1),
('Weekly', 'Repeats every 7 days', 7),
('Monthly', 'Repeats every month', 30),
('Quarterly', 'Repeats every 3 months', 90),
('Half-Yearly', 'Repeats every 6 months', 180),
('Yearly', 'Repeats every year', 365),
('Custom', 'Custom interval', 0),
('Event Based', 'Triggered by specific event', 0)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.status_masters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    badge_color VARCHAR(30) DEFAULT 'bg-gray-100 text-gray-800'
);

INSERT INTO public.status_masters (name, badge_color) VALUES
('Pending', 'bg-yellow-100 text-yellow-800'),
('In Progress', 'bg-blue-100 text-blue-800'),
('Completed', 'bg-green-100 text-green-800'),
('Not Done', 'bg-red-100 text-red-800'),
('Overdue', 'bg-purple-100 text-purple-800'),
('Cancelled', 'bg-gray-100 text-gray-800')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. CHECKLIST MASTERS & TASK INSTANCES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    checklist_code VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'Medium',
    frequency VARCHAR(50) NOT NULL DEFAULT 'Daily',
    start_date DATE NOT NULL,
    end_date DATE,
    reminder_status BOOLEAN DEFAULT TRUE,
    attachment_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
    item_title VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.checklist_task_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    checklist_id UUID REFERENCES public.checklists(id) ON DELETE CASCADE,
    task_code VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    department_id UUID REFERENCES public.departments(id),
    assigned_by UUID REFERENCES public.profiles(id),
    assigned_to UUID REFERENCES public.profiles(id),
    priority VARCHAR(20) DEFAULT 'Medium',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    original_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Not Done', 'Overdue', 'Cancelled')),
    completion_date TIMESTAMP WITH TIME ZONE,
    completion_remarks TEXT,
    proof_image_url TEXT,
    proof_doc_url TEXT,
    items_completed JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. DELEGATIONS (One-Time Tasks)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delegations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    delegation_code VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_by UUID NOT NULL REFERENCES public.profiles(id),
    assigned_to UUID NOT NULL REFERENCES public.profiles(id),
    department_id UUID REFERENCES public.departments(id),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    start_date DATE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    original_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Not Done', 'Overdue', 'Cancelled')),
    completion_date TIMESTAMP WITH TIME ZONE,
    completion_remarks TEXT,
    attachment_url TEXT,
    proof_image_url TEXT,
    proof_doc_url TEXT,
    reminder_setting JSONB DEFAULT '{"system": true, "email": true, "whatsapp": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. DATE EXTENSION SYSTEM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.extension_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('checklist', 'delegation')),
    task_id UUID NOT NULL,
    requested_by UUID NOT NULL REFERENCES public.profiles(id),
    current_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    requested_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT NOT NULL,
    attachment_url TEXT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. TASK COMMENTS, ATTACHMENTS & HISTORY (Audit Timeline)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('checklist', 'delegation')),
    task_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('checklist', 'delegation')),
    task_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,
    file_url TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('checklist', 'delegation')),
    task_id UUID NOT NULL,
    performed_by UUID NOT NULL REFERENCES public.profiles(id),
    action VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. NOTIFICATIONS & REMINDERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    task_type VARCHAR(20) NOT NULL,
    task_id UUID NOT NULL,
    reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('system', 'email', 'whatsapp')),
    trigger_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. SYSTEM SETTINGS & AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE,
    company_name VARCHAR(150) DEFAULT 'Acme Corporate',
    company_logo_url TEXT,
    date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy',
    time_format VARCHAR(20) DEFAULT '12h',
    default_priority VARCHAR(20) DEFAULT 'Medium',
    default_reminder VARCHAR(50) DEFAULT '1 Day Before',
    completion_rules JSONB DEFAULT '{"require_remarks_on_not_done": true, "require_proof_attachment": false}'::jsonb,
    extension_approval_required BOOLEAN DEFAULT TRUE,
    tat_rules JSONB DEFAULT '{"on_time_score": 100, "late_deduction_per_day": 10, "overdue_score": 0}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_task_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extension_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE (
    id UUID,
    organization_id UUID,
    role VARCHAR,
    department_id UUID
) AS $$
    SELECT id, organization_id, role, department_id
    FROM public.profiles
    WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS Policy: Profiles
CREATE POLICY "Users can view profiles in their organization"
ON public.profiles FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id FROM public.get_current_user_profile()
    )
);

CREATE POLICY "Admins can update any profile in org"
ON public.profiles FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.get_current_user_profile() p
        WHERE p.organization_id = profiles.organization_id AND p.role = 'ADMIN'
    )
);

-- RLS Policy: Delegations
CREATE POLICY "Users can view relevant delegations"
ON public.delegations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.get_current_user_profile() p
        WHERE p.organization_id = delegations.organization_id
        AND (
            p.role = 'ADMIN' OR
            p.role = 'MANAGER' OR
            delegations.assigned_to = p.id OR
            delegations.assigned_by = p.id
        )
    )
);

CREATE POLICY "Managers and Admins can create delegations"
ON public.delegations FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.get_current_user_profile() p
        WHERE p.organization_id = delegations.organization_id
        AND (p.role IN ('ADMIN', 'MANAGER'))
    )
);

CREATE POLICY "Assigned users and managers can update delegations"
ON public.delegations FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.get_current_user_profile() p
        WHERE p.organization_id = delegations.organization_id
        AND (
            p.role = 'ADMIN' OR
            p.role = 'MANAGER' OR
            delegations.assigned_to = p.id
        )
    )
);

-- RLS Policy: Checklist Task Instances
CREATE POLICY "Users can view relevant checklist task instances"
ON public.checklist_task_instances FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.get_current_user_profile() p
        WHERE p.organization_id = checklist_task_instances.organization_id
        AND (
            p.role = 'ADMIN' OR
            p.role = 'MANAGER' OR
            checklist_task_instances.assigned_to = p.id OR
            checklist_task_instances.assigned_by = p.id
        )
    )
);

CREATE POLICY "Assigned users can update checklist task instances"
ON public.checklist_task_instances FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.get_current_user_profile() p
        WHERE p.organization_id = checklist_task_instances.organization_id
        AND (
            p.role = 'ADMIN' OR
            p.role = 'MANAGER' OR
            checklist_task_instances.assigned_to = p.id
        )
    )
);

-- RLS Policy: Notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 12. STORAGE BUCKET CREATION (Supabase Storage)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-attachments', 'task-attachments', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access for task attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'task-attachments');

CREATE POLICY "Authenticated upload for task attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'task-attachments' AND auth.role() = 'authenticated');
