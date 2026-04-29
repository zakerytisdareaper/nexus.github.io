-- Cleanup function: delete messages older than 1 hour
CREATE OR REPLACE FUNCTION public.cleanup_old_chat_messages()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.chat_messages WHERE created_at < now() - INTERVAL '1 hour';
  RETURN NEW;
END;
$$;

-- Run cleanup whenever a new message is inserted (cheap, opportunistic)
DROP TRIGGER IF EXISTS trg_cleanup_chat_messages ON public.chat_messages;
CREATE TRIGGER trg_cleanup_chat_messages
AFTER INSERT ON public.chat_messages
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_old_chat_messages();

REVOKE EXECUTE ON FUNCTION public.cleanup_old_chat_messages() FROM PUBLIC, anon, authenticated;