# sos-campo

Aplicativo móvel em React Native (Expo) para orientar e acionar ajuda rápida em emergências no campo.

## O que o app faz
- **Guia de primeiros socorros**: lista de acidentes com passos iniciais; abre detalhes de cada caso.
- **Chamadas de emergência rápidas**: botões para SAMU (192), Bombeiros (193), Polícia Militar (190), PRF (191) e Disque Intoxicação ANVISA (0800 722 6001).
- **Compartilhamento de localização**: componente dedicado para obter e enviar sua posição geográfica ao pedir socorro.
- **Navegação acessível**: interface com botões grandes, rótulos de acessibilidade e feedback de toque.
- **Seção jurídica e de fontes**: links internos para termos de uso, privacidade e referências.
- **Calculadora de IMC**: acesso direto a uma calculadora de índice de massa corporal.

## Tecnologias
- **Expo + React Native**
- **TypeScript**
- **expo-router** para navegação em pilha.
- **expo-location** (permissões configuradas no app) para acesso à localização.

## Requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI (opcional, mas recomendado para desenvolvimento e builds)

## Como executar
1. Clone o repositório:
   ```bash
   git clone https://github.com/LeoniAlvesD/sos-campo.git
   cd sos-campo
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```
3. Inicie o app (modo desenvolvimento):
   ```bash
   npm start
   # ou
   npx expo start
   ```
4. Rodar em dispositivo/emulador:
   ```bash
   npm run android
   npm run ios
   # ou via Expo
   npx expo run:android
   npx expo run:ios
   ```

## Estrutura resumida
- `app/` — rotas (home, primeiros socorros, emergência, legal, etc.).
- `components/` — componentes reutilizáveis (ex.: compartilhamento de localização).
- `constants/` — temas e listas (ex.: acidentes).
- `assets/` — ícones, imagens e splash.

## Contribuição
Contribuições são bem-vindas! Abra uma issue ou envie um PR com sua melhoria.

## Licença
MIT
