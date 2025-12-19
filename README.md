### 🚗 Caronar — Aplicação de Solicitação de Corridas
O Caronar é uma aplicação web inspirada em apps de transporte urbano, desenvolvida com foco em experiência mobile, permitindo que usuários solicitem corridas, escolham o tipo de transporte, visualizem rotas no mapa, confirmem motoristas e acompanhem o histórico de viagens.
### 📱 Visão Geral do Projeto
O sistema permite que o usuário:
- Crie uma conta e faça login
- Visualize e edite seu perfil (incluindo foto)
- Solicite uma corrida usando geolocalização
- Busque o destino digitando o local desejado
- Visualize a rota no mapa (Leaflet + Routing Machine)
- Escolha o meio de transporte (Moto, Carro ou Van)
- Veja o preço estimado da corrida
- Confirme um motorista (genérico)
- Realize o pagamento (simulado)
- Visualize o histórico de corridas realizadas
- Toda a interface foi pensada para simular um aplicativo mobile, mesmo rodando no navegador.
### 🧭 Fluxo da Corrida
## Solicitar Corrida
A localização atual do usuário é obtida automaticamente
O usuário digita o destino
O mapa traça a rota entre origem e destino
A cidade atual é exibida no rodapé
Escolha do Meio de Transporte
Opções disponíveis:
- 🏍️ Moto
- 🚗 Carro
- 🚐 Van
O preço é calculado com base na distância da rota
### Motorista Encontrado
Um motorista genérico é exibido conforme o transporte escolhido
Avaliação simulada
### Pagamento
Tela de pagamento genérica
Após confirmar, a corrida é finalizada
Histórico
Exibe todas as corridas do usuário
Mostra:
Local de partida (nome)
Local de chegada (nome)
Tipo de transporte
Preço
Motorista e avaliação
### 🛠️ Tecnologias Utilizadas
### Front-end
- HTML5
- CSS3 (layout mobile-first)
- JavaScript puro
- Handlebars
- Leaflet.js
- Leaflet Routing Machine
### Back-end
- Node.js
- Express
- Express-Handlebars
- Sequelize (ORM)
- MySQL
- Express-session
- Multer (upload de imagem)
- Bcrypt (criptografia de senha)
### 🗂️ Estrutura do Projeto (Resumo)
📦 projeto ├── 📁 public │ ├── 📁 css │ │ ├── app.css │ │ ├── solicitarCorrida.css │ │ └── historico.css │ ├── 📁 js │ │ ├── solicitarCorrida.js │ │ ├── meioTransporte.js │ │ └── motoristaEncontrado.js │ └── 📁 img ├── 📁 views │ ├── 📁 layouts │ │ ├── main.handlebars │ │ └── solicitarCorrida.handlebars │ ├── index.handlebars │ ├── perfil.handlebars │ ├── historico.handlebars │ ├── atualizarPerfil.handlebars │ └── meioTransporte.handlebars ├── 📁 models │ ├── Usuario.js │ └── Corrida.js ├── server.js └── README.md
### 👤 Funcionalidades do Usuário
- Cadastro com senha criptografada
- Login com sessão
- Upload de foto de perfil
- Atualização de dados
- Exclusão de conta
- Logout
### 🗺️ Mapas e Geolocalização
A localização inicial é obtida via navigator.geolocation
Endereços são convertidos usando Nominatim (OpenStreetMap)
As rotas são traçadas com Leaflet Routing Machine
A cidade atual é exibida dinamicamente na interface
### 🎨 Interface
Design responsivo no formato de aplicativo mobile
Menu inferior fixo com navegação
Cores padronizadas (vermelho/coral)
Cards reutilizáveis para perfil, histórico e opções
### ⚠️ Observações Importantes
A funcionalidade de Configurações ainda está em desenvolvimento (exibe “Em breve”)
O pagamento é apenas uma simulação
Motoristas são gerados de forma genérica para fins acadêmicos
### 🚀 Como Executar o Projeto
Instale as dependências:
npm install
Configure o banco de dados no arquivo:
src/config/database.js
Inicie o servidor:
node server.js
Acesse no navegador:
http://localhost:3000
📌 Status do Projeto
✅ Finalizado (porem com melhorias que podem ser feitas futuramente) 📱 Layout mobile concluído🗺️ Mapa e rotas funcionando📊 Histórico persistente no banco
