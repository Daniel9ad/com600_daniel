--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2025-05-22 14:43:15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 81815)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 81826)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    creation_user character varying(50) NOT NULL,
    update_user character varying(50) NOT NULL,
    creation_time timestamp without time zone DEFAULT now() NOT NULL,
    update_time timestamp without time zone DEFAULT now() NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(250) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 81837)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    creation_user character varying(50) NOT NULL,
    update_user character varying(50) NOT NULL,
    creation_time timestamp without time zone DEFAULT now() NOT NULL,
    update_time timestamp without time zone DEFAULT now() NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 81846)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    creation_user character varying(50) NOT NULL,
    update_user character varying(50) NOT NULL,
    creation_time timestamp without time zone DEFAULT now() NOT NULL,
    update_time timestamp without time zone DEFAULT now() NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    email character varying(70) NOT NULL,
    password character varying(600) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4873 (class 0 OID 81826)
-- Dependencies: 216
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, creation_user, update_user, creation_time, update_time, status, name, description) FROM stdin;
04a59de8-3fd3-4ec0-9fa2-45f904d24a7a	a4ab1717-a87b-4cf4-ac8e-370f1609b8c6	a4ab1717-a87b-4cf4-ac8e-370f1609b8c6	2025-05-22 00:29:51.517035	2025-05-22 00:29:51.517035	0	admin	admin
de04b3e0-3579-44d0-879a-9a10e74131bc	a0cba1ea-d5df-4744-92d8-012d5f935807	a0cba1ea-d5df-4744-92d8-012d5f935807	2025-05-22 15:06:28.088007	2025-05-22 15:06:28.088007	0	customer	customer
\.


--
-- TOC entry 4874 (class 0 OID 81837)
-- Dependencies: 217
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, creation_user, update_user, creation_time, update_time, status, user_id, role_id) FROM stdin;
73174589-80d0-4bb8-b531-0e9098b51f86	a4ab1717-a87b-4cf4-ac8e-370f1609b8c6	a4ab1717-a87b-4cf4-ac8e-370f1609b8c6	2025-05-22 00:37:28.608807	2025-05-22 00:37:28.608807	0	a0cba1ea-d5df-4744-92d8-012d5f935807	04a59de8-3fd3-4ec0-9fa2-45f904d24a7a
\.


--
-- TOC entry 4875 (class 0 OID 81846)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, creation_user, update_user, creation_time, update_time, status, email, password) FROM stdin;
a4ab1717-a87b-4cf4-ac8e-370f1609b8c6	admin	admin	2025-05-21 23:57:16.093581	2025-05-21 23:57:16.093581	0	usuario@ejemplo.com	123456
a0cba1ea-d5df-4744-92d8-012d5f935807	a4ab1717-a87b-4cf4-ac8e-370f1609b8c6	a4ab1717-a87b-4cf4-ac8e-370f1609b8c6	2025-05-22 00:26:51.190637	2025-05-22 00:26:51.190637	0	daniel@gmail.com	$2b$10$foRWXiS9tWaOnz8BDX53SOjiszSc1nJjABwr6mP/RfsJxc1dNR1.O
\.


--
-- TOC entry 4723 (class 2606 OID 81845)
-- Name: user_roles PK_8acd5cf26ebd158416f477de799; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY (id);


--
-- TOC entry 4725 (class 2606 OID 81856)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 4719 (class 2606 OID 81834)
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- TOC entry 4721 (class 2606 OID 81836)
-- Name: roles UQ_648e3f5447f725579d7d4ffdfb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE (name);


--
-- TOC entry 4727 (class 2606 OID 81858)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 4728 (class 2606 OID 81859)
-- Name: user_roles FK_87b8888186ca9769c960e926870; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4729 (class 2606 OID 81864)
-- Name: user_roles FK_b23c65e50a758245a33ee35fda1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY (role_id) REFERENCES public.roles(id);


-- Completed on 2025-05-22 14:43:16

--
-- PostgreSQL database dump complete
--






--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2025-05-22 14:45:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 90018)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id bigint NOT NULL,
    nombre text,
    fecha timestamp with time zone,
    lugar text,
    capacidad bigint,
    precio numeric
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 90017)
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- TOC entry 4841 (class 0 OID 0)
-- Dependencies: 215
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- TOC entry 4688 (class 2604 OID 90021)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- TOC entry 4835 (class 0 OID 90018)
-- Dependencies: 216
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, nombre, fecha, lugar, capacidad, precio) FROM stdin;
1	evento1	2025-06-01 10:00:00+00	lugar1	100	150
2	evento1	2025-06-01 10:00:00+00	lugar1	100	150
3	evento1	2025-06-01 10:00:00+00	lugar1	100	150
4	evento1	2025-06-01 10:00:00+00	lugar1	100	150
\.


--
-- TOC entry 4842 (class 0 OID 0)
-- Dependencies: 215
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 4, true);


--
-- TOC entry 4690 (class 2606 OID 90025)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


-- Completed on 2025-05-22 14:45:35

--
-- PostgreSQL database dump complete
--



--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2025-05-22 14:46:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 841 (class 1247 OID 98200)
-- Name: purchasestatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.purchasestatus AS ENUM (
    'PENDING',
    'PAID',
    'CANCELED'
);


ALTER TYPE public.purchasestatus OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 98233)
-- Name: compras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compras (
    id integer NOT NULL,
    user_id character varying,
    event_id integer,
    event_name character varying,
    quantity integer,
    total_price double precision,
    status public.purchasestatus,
    purchase_date timestamp with time zone DEFAULT now(),
    payment_date timestamp with time zone
);


ALTER TABLE public.compras OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 98232)
-- Name: compras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.compras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compras_id_seq OWNER TO postgres;

--
-- TOC entry 4848 (class 0 OID 0)
-- Dependencies: 215
-- Name: compras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.compras_id_seq OWNED BY public.compras.id;


--
-- TOC entry 4691 (class 2604 OID 98236)
-- Name: compras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras ALTER COLUMN id SET DEFAULT nextval('public.compras_id_seq'::regclass);


--
-- TOC entry 4842 (class 0 OID 98233)
-- Dependencies: 216
-- Data for Name: compras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compras (id, user_id, event_id, event_name, quantity, total_price, status, purchase_date, payment_date) FROM stdin;
1	1	1	name	2	100	PENDING	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
2	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
3	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
4	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
5	1	1	name	2	100	PENDING	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
6	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
7	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
8	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
9	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
10	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
11	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
12	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
13	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
14	1	1	name	2	100	PAID	2025-05-22 04:26:51.190637+00	2025-05-22 04:26:51.190637+00
\.


--
-- TOC entry 4849 (class 0 OID 0)
-- Dependencies: 215
-- Name: compras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compras_id_seq', 14, true);


--
-- TOC entry 4694 (class 2606 OID 98241)
-- Name: compras compras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_pkey PRIMARY KEY (id);


--
-- TOC entry 4695 (class 1259 OID 98243)
-- Name: ix_compras_event_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_compras_event_id ON public.compras USING btree (event_id);


--
-- TOC entry 4696 (class 1259 OID 98244)
-- Name: ix_compras_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_compras_id ON public.compras USING btree (id);


--
-- TOC entry 4697 (class 1259 OID 98242)
-- Name: ix_compras_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_compras_user_id ON public.compras USING btree (user_id);


-- Completed on 2025-05-22 14:46:35

--
-- PostgreSQL database dump complete
--

