-- Revisar os agregados antes de autorizar sua publicação.
-- Executar no SQL Editor do Supabase como administrador.
-- Nenhuma política RLS de tabela é modificada.
BEGIN;

CREATE OR REPLACE FUNCTION public.get_public_project_stats()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    WITH cutoff AS (
        SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS today
    ),
    sessions AS (
        SELECT c.class_date, c.turno
        FROM public.class_sessions AS c
        CROSS JOIN cutoff
        WHERE c.status = 'realizada'
          AND c.class_date <= cutoff.today
    )
    SELECT jsonb_build_object(
        'active_students', (
            SELECT count(*) FROM public.students AS s WHERE s.ativo IS TRUE
        ),
        'active_teachers', (
            SELECT count(*) FROM public.teachers AS t WHERE t.ativo IS TRUE
        ),
        'completed_sessions', (
            SELECT count(*) FROM sessions
        ),
        'known_duration_minutes', (
            SELECT count(*) * 105 FROM sessions
            WHERE turno IN ('Manhã', 'Tarde')
        ),
        'attendance_presences', (
            SELECT count(*) FROM public.attendance AS a
            CROSS JOIN cutoff
            WHERE a.present IS TRUE AND a.class_date <= cutoff.today
        ),
        'activity_days', (
            SELECT count(DISTINCT class_date) FROM sessions
        ),
        'unknown_duration_sessions', (
            SELECT count(*) FROM sessions
            WHERE turno IS NULL OR turno NOT IN ('Manhã', 'Tarde')
        )
    );
$$;

REVOKE ALL ON FUNCTION public.get_public_project_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_project_stats() TO anon, authenticated;

COMMIT;

-- Conferência administrativa do JSON retornado:
SELECT public.get_public_project_stats();

-- Para suspender a publicação sem mudar RLS:
-- REVOKE EXECUTE ON FUNCTION public.get_public_project_stats() FROM anon, authenticated;
