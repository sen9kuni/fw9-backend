--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

-- Started on 2022-07-11 15:52:36

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

DROP DATABASE "Ewallet";
--
-- TOC entry 3351 (class 1262 OID 16812)
-- Name: Ewallet; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "Ewallet" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_Indonesia.1252';


ALTER DATABASE "Ewallet" OWNER TO postgres;

\connect "Ewallet"

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
-- TOC entry 3 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3352 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 212 (class 1259 OID 16820)
-- Name: profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile (
    id integer NOT NULL,
    fullname character varying,
    phonenumber character varying,
    balance numeric,
    picture character varying,
    user_id integer NOT NULL
);


ALTER TABLE public.profile OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16819)
-- Name: profile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.profile ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 216 (class 1259 OID 16832)
-- Name: transaction_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_type (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text
);


ALTER TABLE public.transaction_type OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16831)
-- Name: transaction_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.transaction_type ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.transaction_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 214 (class 1259 OID 16826)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    amount numeric NOT NULL,
    recipient_id integer NOT NULL,
    sender_id integer NOT NULL,
    note text,
    "time" timestamp without time zone NOT NULL,
    type_id_trans integer NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16825)
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.transactions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 210 (class 1259 OID 16814)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    username character varying NOT NULL,
    pin character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16813)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3341 (class 0 OID 16820)
-- Dependencies: 212
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profile (id, fullname, phonenumber, balance, picture, user_id) FROM stdin;
1	ramdhan	089547214467	450000	\N	1
2	\N	\N	300000	\N	2
\.


--
-- TOC entry 3345 (class 0 OID 16832)
-- Dependencies: 216
-- Data for Name: transaction_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_type (id, name, description) FROM stdin;
1	transfer	send some money
\.


--
-- TOC entry 3343 (class 0 OID 16826)
-- Dependencies: 214
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, amount, recipient_id, sender_id, note, "time", type_id_trans) FROM stdin;
1	50000	2	1	hutang	2022-07-11 00:29:15.406263	1
2	50000	2	1	hutang	2022-07-11 00:30:57.777431	1
3	100000	2	1	hutang	2022-07-11 00:31:34.498269	1
4	100000	2	1	hutang	2022-07-11 00:36:13.592354	1
\.


--
-- TOC entry 3339 (class 0 OID 16814)
-- Dependencies: 210
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, username, pin) FROM stdin;
1	ucupkecubung@gmail.com	$2b$10$84dht.r3QIoLAHk76uInaOw47X.0kQuhM0/0hmhf.XCK5J.7PgDFS	ramdhanucup	666669
2	sansyoga@gmail.com	$2b$10$sEQUau/31hsUlwChZknZ1uBj/JZwJ6h/3KUM/IpKgP0tiIdZp2/gK	yogapra	\N
\.


--
-- TOC entry 3353 (class 0 OID 0)
-- Dependencies: 211
-- Name: profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profile_id_seq', 2, true);


--
-- TOC entry 3354 (class 0 OID 0)
-- Dependencies: 215
-- Name: transaction_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_type_id_seq', 1, true);


--
-- TOC entry 3355 (class 0 OID 0)
-- Dependencies: 213
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 4, true);


--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 3180 (class 2606 OID 16844)
-- Name: users email_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT email_un UNIQUE (email);


--
-- TOC entry 3186 (class 2606 OID 16852)
-- Name: profile phone_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT phone_un UNIQUE (phonenumber);


--
-- TOC entry 3188 (class 2606 OID 16848)
-- Name: profile profile_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pk PRIMARY KEY (id);


--
-- TOC entry 3194 (class 2606 OID 16838)
-- Name: transaction_type transaction_type_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_type
    ADD CONSTRAINT transaction_type_pk PRIMARY KEY (id);


--
-- TOC entry 3192 (class 2606 OID 16840)
-- Name: transactions transactions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pk PRIMARY KEY (id);


--
-- TOC entry 3190 (class 2606 OID 16850)
-- Name: profile userid_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT userid_un UNIQUE (user_id);


--
-- TOC entry 3182 (class 2606 OID 16846)
-- Name: users username_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT username_un UNIQUE (username);


--
-- TOC entry 3184 (class 2606 OID 16842)
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- TOC entry 3195 (class 2606 OID 16853)
-- Name: profile profile_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3196 (class 2606 OID 16858)
-- Name: transactions recipient; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT recipient FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON UPDATE SET NULL ON DELETE SET NULL;


--
-- TOC entry 3197 (class 2606 OID 16863)
-- Name: transactions sender; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT sender FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE SET NULL ON DELETE SET NULL;


--
-- TOC entry 3198 (class 2606 OID 16868)
-- Name: transactions typetransac; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT typetransac FOREIGN KEY (type_id_trans) REFERENCES public.transaction_type(id) ON UPDATE SET NULL ON DELETE SET NULL;


-- Completed on 2022-07-11 15:52:36

--
-- PostgreSQL database dump complete
--

