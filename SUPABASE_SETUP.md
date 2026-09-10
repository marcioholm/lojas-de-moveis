# Configuração do Supabase (Admin + E-mail)

Para que os fluxos de criação de conta e convite de vendedores funcionem perfeitamente enviando os e-mails, precisamos configurar o SMTP da **Resend** no Supabase e criar seu primeiro usuário Admin.

## Passo 1: Configurar SMTP da Resend no Supabase

1. Acesse o painel do seu projeto no [Supabase](https://supabase.com).
2. No menu lateral esquerdo, clique em **Authentication** e depois em **Providers**.
3. Vá em **Email** e ative a opção **Enable Email Provider** se já não estiver.
4. Desça até a seção **SMTP Settings** e ative a opção **Enable Custom SMTP**.
5. Preencha com os dados abaixo da Resend:
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (pode tentar `587` se `465` não for aceita)
   - **User:** `resend`
   - **Password:** `SUA_CHAVE_API_AQUI`
   - **Sender email:** Seu e-mail de domínio verificado na Resend (ex: `contato@suamarca.com.br`)
   - **Sender name:** `VitrinaHub (Sua Loja)`
6. Clique em **Save**.

## Passo 2: Testar o Fluxo na Aplicação

1. Acesse a rota pública **`/signup`** da nossa aplicação.
2. Preencha seus dados reais (Seu e-mail, CPF, etc.).
3. Conclua o cadastro. O Supabase agora irá disparar o e-mail de confirmação real via Resend.
4. Verifique sua caixa de entrada e clique no link de confirmação.

## Passo 3: Criar o Perfil Admin

Nosso código de `signup` (`src/app/signup/actions.ts`) já está programado para inserir o seu usuário nas tabelas `stores` e `profiles` como `admin`. 

**Para garantir que as tabelas existam no Supabase:**
1. Acesse o **SQL Editor** no painel do Supabase.
2. Rode o seguinte script para criar as tabelas base (se ainda não tiver criado):

```sql
create table if not exists public.stores (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  cnpj text,
  uf text,
  city text,
  employees text,
  owner_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.profiles (
  id uuid references auth.users primary key,
  full_name text,
  cpf text,
  phone text,
  role text default 'user',
  store_id uuid references public.stores(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

Pronto! Agora o VitrinaHub tem o banco de dados preparado para receber lojistas reais.
