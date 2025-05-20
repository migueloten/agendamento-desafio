# Agendamento de Serviços - Desafio Liga

Este projeto é uma aplicação web para gerenciamento de agendamentos de consultas médicas, desenvolvido como parte de um desafio técnico da Liga. O sistema permite o cadastro e gerenciamento de especialidades, convênios, médicos, horários, agendamentos e atendimentos, proporcionando uma interface moderna e intuitiva para clínicas e consultórios.

## Funcionalidades

- **Cadastro de Especialidades:** Gerencie as especialidades médicas disponíveis.
- **Cadastro de Convênios:** Adicione e visualize convênios aceitos.
- **Cadastro de Médicos:** Associe médicos às especialidades.
- **Gestão de Horários:** Defina horários de atendimento para cada médico.
- **Agendamento de Consultas:** Permite agendar consultas, escolhendo especialidade, médico, convênio, data e horário disponível.
- **Atendimentos:** Registre e visualize o status e resolução dos atendimentos realizados.
- **Interface Responsiva:** Desenvolvido com React, TailwindCSS e React Router, proporcionando uma experiência fluida.

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [React Select](https://react-select.com/)
- [Zod](https://zod.dev/) (validação de formulários)
- [Vite](https://vitejs.dev/) (build e dev server)
- [json-server](https://github.com/typicode/json-server) (API fake para simulação de backend)

## Instalação

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/migueloten/agendamento-desafio.git
   cd agendamento-desafio
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Inicie o servidor fake (json-server):**
   > Certifique-se de ter o `json-server` instalado globalmente. Se não tiver, instale com:
   > ```sh
   > npm install -g json-server
   > ```
   Inicie o servidor:
   ```sh
   json-server --watch db.json --port 3000
   ```

4. **Rode o projeto em modo desenvolvimento:**
   Em outro terminal, execute:
   ```sh
   npm run dev
   ```

5. **Acesse no navegador:**
   ```
   http://localhost:5173
   ```

## Estrutura do Projeto

- `src/pages/` — Páginas principais do sistema (Especialidades, Convênios, Médicos, Horários, Agendamentos, Atendimentos, Home, etc).
- `src/components/` — Componentes reutilizáveis (inputs, modais, header, etc).
- `src/assets/` — Imagens e logos.
- `db.json` — Banco de dados fake utilizado pelo json-server.

## Observações

- O projeto utiliza um backend fake (`json-server`) apenas para simulação. Não há persistência real de dados em produção.
- Para customizar as especialidades, médicos, horários, etc., edite o arquivo [`db.json`](db.json).
- O sistema foi desenvolvido para fins de avaliação técnica e pode ser expandido conforme necessidade.

---
