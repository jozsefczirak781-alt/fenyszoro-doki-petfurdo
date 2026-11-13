CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  car text NOT NULL,
  problem text NOT NULL,
  message text,
  photo_paths text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'új',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  car text NOT NULL,
  service text NOT NULL,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (booking_date, booking_time)
);
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_booked_times(_date date)
RETURNS SETOF text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT booking_time FROM public.bookings WHERE booking_date = _date;
$$;
REVOKE ALL ON FUNCTION public.get_booked_times(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_booked_times(date) TO anon, authenticated, service_role;