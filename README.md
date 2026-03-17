# SOS CAMPO

Orientação rápida para primeiros socorros em emergências no campo, com ou sem acesso à internet.

---

## SOBRE O PROJETO

SOS Campo e um aplicativo mobile educativo desenvolvido para funcionar com ou sem internet, permitindo que produtores rurais acessem informacoes criticas de primeiros socorros e emergencias, mesmo em areas com conectividade limitada.

Por que?
- Ambiente Rural: Regioes agricolas frequentemente tem sinal fraco
- Emergencias: Informacoes criticas precisam estar sempre disponiveis
- Tempo e Ouro: Cada segundo conta em uma emergencia
- Acessibilidade: Interface clara e intuitiva para situacoes de stress

---

## PRINCIPAIS FUNCIONALIDADES

PRIMEIROS SOCORROS
- Guia ilustrado de primeiros socorros para acidentes comuns
- Passos claros e objetivos
- Avisos sobre o que NAO fazer
- Referencias de fontes oficiais (Ministerio da Saude, ANVISA)

EMERGENCIAS
Acesso direto a contatos essenciais:
- SAMU: 192
- Bombeiros: 193
- Policia Militar: 190
- Policia Rodoviaria Federal: 191
- Disque Intoxicacao (ANVISA): 0800 722 6001
- Ligar diretamente com um toque no botao

LOCALIZACAO INTEGRADA
- Obter GPS em alta precisao (tela de Emergencia)
- Exibir coordenadas precisas na tela
- Link direto para abrir no Google Maps
- Copiar coordenadas para clipboard
- Compartilhar via Share API nativa do dispositivo
- Historico completo de localizacoes (SQLite)
- Acesso ao historico sem internet

CALCULADORA DE IMC
- Ferramenta rapida para calculo
- Facil interpretacao de resultados

INFORMACOES LEGAIS
- Termos de Uso
- Politica de Privacidade
- Fontes e Referencias

---

## ARQUITETURA

OFFLINE-FIRST DESIGN

CAMADA DE PERSISTENCIA LOCAL

AsyncStorage
- Armazenamento rapido de localizacao recente
- Acesso instantaneo sem banco de dados

SQLite Database
- Historico completo de localizacoes capturadas
- CRUD completo (Create, Read, Update, Delete)
- Acesso total sem internet
- Timestamps de cada captura

Constants (Bundled)
- Primeiros socorros
- Numeros de emergencia
- Dados estaticos do app
- Design system centralizado

COM INTERNET (Na tela de Emergencia)

Acesso a Servicos de Mapas

Google Maps (abrir localizacao em mapa)
Share API Nativa (WhatsApp, SMS, Email, etc - conforme apps instalados)

---

## TECH STACK

Tecnologia         Versao      Proposito
React Native       v0.76+      Framework mobile
Expo               Latest      Runtime e Build
Expo Router        Latest      Navegacao
TypeScript         5.0+        Type safety
SQLite             expo-sqlite Persistencia local
AsyncStorage       Latest      Cache rapido
Expo Location      Latest      Servicos de GPS

---

## ESTRUTURA DO PROJETO

sos-campo/

app/                           Telas (Expo Router)
- _layout.tsx                Layout raiz
- SOS_Campo/                 Navegacao principal (Tabs)
  - index.tsx               Home
  - acidentes.tsx           Primeiros socorros
  - emergencia.tsx          Emergencias, contatos e localizacao
  - calculadora.tsx         IMC Calculator
  - _layout.tsx             Tab navigation
- acidente/[id].tsx         Detalhe do acidente
- legal/                    Paginas legais
  - termos.tsx
  - privacidade.tsx
  - fontes.tsx

components/                    Componentes Reutilizaveis
- LocationShare.tsx          Widget de localizacao (usado em Emergencia)
- ShareLocationModal.tsx     Modal expandido (codigos preparados para futuro)
- EmergencyCard.tsx          Card de contato de emergencia

hooks/                        Custom Hooks
- useLocationDatabase.ts     SQLite CRUD
- useResponsive.ts           Responsividade

utils/                        Utilitarios
- locationStorage.ts         AsyncStorage helpers
- locationSharing.ts         Funcoes de localizacao e compartilhamento

constants/                    Dados Estaticos
- theme.ts                  Design system
- acidentes.ts              DB de acidentes

assets/                       Imagens e Icones
- images/

app.json                      Configuracao Expo
package.json                  Dependencias
tsconfig.json                 TypeScript config
README.md                     Esta documentacao

---

## COMO COMCAR

PRE-REQUISITOS
- Node.js 18+ ou Yarn
- Expo CLI (opcional, usa npx)
- Mobile Device com Expo Go instalado (ou emulador)

INSTALACAO

1. Clone o repositorio
git clone https://github.com/LeoniAlvesD/sos-campo.git
cd sos-campo

2. Instale dependencias
npm install
ou
yarn install

3. Inicie o desenvolvimento
npm start
ou
npx expo start

4. Visualize no seu dispositivo

Opcao 1: Expo Go (Recomendado para testes)
- Baixe o app "Expo Go" na Play Store ou App Store
- Escaneie o QR code no terminal

Opcao 2: Build Local
npm run ios        (macOS apenas)
npm run android

BUILD PARA PRODUCAO

Build APK (Android)
eas build --platform android --local

Build IPA (iOS)
eas build --platform ios --local

Build Universal
eas build

---

## FLUXO DE USO - EMERGENCIA

1. Usuario aciona a aba "Emergencia"

2. Ve todos os numeros de emergencia (SAMU, Bombeiros, Policia, etc)

3. Pode ligar diretamente para qualquer numero
   - Toca no card do numero desejado
   - Telefone abre automaticamente a discagem
   - Apenas pressiona "chamar" ou ativa o viva-voz

4. Na secao "Sua Localizacao":
   - Clica em "Obter Minha Localizacao"
   - App solicita permissao de GPS (primeira vez)
   - Captura coordenadas com alta precisao
   - Exibe as coordenadas na tela
   - Mostra link para Google Maps
   - Salva no historico SQLite automaticamente

5. Com as coordenadas capturadas, usuario pode:
   - Clicar no link "Abrir no Google Maps" (requer internet)
   - Botao "Copiar": copia coordenadas para clipboard
   - Botao "Compartilhar": abre Share API nativa
     (aparece WhatsApp, SMS, Email, etc conforme apps instalados)
   - Botao "Limpar": remove coordenadas da tela
   - Botao "Atualizar Localizacao": captura nova coordenada

---

## PERSISTENCIA DE DADOS

ASYNCSTORAGE
Armazena a localizacao mais recente capturada:

import { saveLocation, getLocation } from '@/utils/locationStorage';

Salvar localizacao recente
await saveLocation({ latitude: -15.7975, longitude: -47.8919 });

Recuperar localizacao
const location = await getLocation();

Remover localizacao
await removeLocation();

SQLITE (HISTORICO DE LOCALIZACOES)
Banco de dados local para historico completo:

import { createTable, insertLocation, getLocations, deleteLocation } from '@/hooks/useLocationDatabase';

Criar tabela (automatico na primeira execucao)
await createTable();

Inserir localizacao no historico
await insertLocation(-15.7975, -47.8919, 10.5, new Date().toISOString());

Recuperar historico completo
const locations = await getLocations();
locations.forEach(loc => {
  console.log(`${loc.latitude}, ${loc.longitude} - ${loc.timestamp}`);
});

Deletar localizacao especifica
await deleteLocation(locationId);

---

## FUNCIONALIDADES OFFLINE VS ONLINE

Funcionalidade                                  Offline Online
Ver primeiros socorros                          Sim     Sim
Acessar numeros de emergencia                   Sim     Sim
Ligar para numero de emergencia                 Sim     Sim
Obter localizacao (GPS)                         Sim     Sim
Ver coordenadas                                 Sim     Sim
Ver historico de localizacoes                   Sim     Sim
Copiar coordenadas                              Sim     Sim
Abrir Google Maps                               Nao     Sim
Compartilhar via Share API (WhatsApp, etc)      Nao     Sim
Calcular IMC                                    Sim     Sim
Ver termos e politica de privacidade            Sim     Sim

---

## DESIGN SYSTEM

Cores e espacamento centralizados em constants/theme.ts:

export const theme = {
  colors: {
    primary: '#1F4D3A',      Verde (principal)
    secondary: '#FFFFFF',     Branco
    danger: '#DC2626',        Vermelho (emergencia)
    emphasis: '#F59E0B',      Laranja (destaque)
    background: '#F3F4F6',
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
  },
  font: {
    title: 28,
    subtitle: 16,
    text: 14,
  },
};

---

## ACESSIBILIDADE

Implementada em todo o app:
- accessibilityLabel: Descricoes detalhadas para leitores de tela
- accessibilityRole: Identificacao correta de elementos
- Cores contrastadas: WCAG AA compliance
- Tamanho de fonte: Legivel em todos os dispositivos
- Touch targets: Minimo 44x44pt para toque comodo
- Estados de carregamento: Indicadores visuais durante operacoes

---

## DOCUMENTACAO DE DADOS

ESTRUTURA DE ACIDENTE

interface Acidente {
  id: string;
  nome: string;                    Ex: "Picada de cobra"
  descricao: string;               Descricao breve
  passos: string[];                Acoes a tomar
  naoFazer: string[];              Avisos importantes
  referencias?: string;            Links para mais info
}

ESTRUTURA DE LOCALIZACAO (SQLITE)

interface Location {
  id: number;                      PK Autoincrement
  latitude: number;                Latitude GPS
  longitude: number;               Longitude GPS
  accuracy: number | null;         Precisao em metros
  timestamp: string;               ISO 8601 timestamp
}

ESTRUTURA DE CONTATO DE EMERGENCIA

interface EmergencyContact {
  label: string;                   Ex: "Atendimento Medico"
  title: string;                   Ex: "SAMU"
  number: string;                  Numero para ligar (string)
  displayNumber?: string;          Numero formatado para exibir
  color: string;                   Cor do card (#hexcolor)
  stripe?: boolean;                Faixa PRF (amarela) opcional
}

---

## TESTES

Preparacao para adicionar testes:

npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

npm test

---

## SEGURANCA E PRIVACIDADE

POLITICA DE PRIVACIDADE
- Nenhum dado pessoal e coletado
- Nenhuma informacao e enviada para servidor
- Tudo fica local no dispositivo do usuario
- Historico de localizacoes fica armazenado localmente
- Compartilhamento e completamente opcional
- Usuario tem controle total sobre o que compartilha

CONFORMIDADE
- Lei Geral de Protecao de Dados (LGPD) - Brasil
- Documentado em /legal/privacidade.tsx
- Documentado em /legal/termos.tsx

PERMISSOES NECESSARIAS
- ACCESS_FINE_LOCATION: Solicitada apenas quando usuario clica em "Obter Localizacao"
- ACCESS_COARSE_LOCATION: Fallback automatico
- CALL_PHONE: Necessaria para ligar para numeros de emergencia
- Nenhuma permissao de armazenamento de fotos
- Nenhuma permissao de contatos

---

## REQUISITOS DO SISTEMA

ANDROID
- Versao minima: 7.0+ (API 24+)
- Recomendado: 10.0+ (API 29+)
- Permissoes:
  - ACCESS_FINE_LOCATION (GPS de alta precisao)
  - ACCESS_COARSE_LOCATION (GPS aproximado)
  - CALL_PHONE (ligar para emergencia)

IOS
- Versao minima: 14.0+
- Recomendado: 15.0+
- Permissoes:
  - NSLocationWhenInUseUsageDescription (GPS)
  - NSPhotoLibraryUsageDescription (para compartilhamento)

---

## CONTRIBUINDO

Contribuicoes sao bem-vindas! Para contribuir:

1. Fork o repositorio
2. Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
3. Commit suas mudancas (git commit -m 'Add AmazingFeature')
4. Push para a branch (git push origin feature/AmazingFeature)
5. Abra um Pull Request

DIRETRIZES
- Mantenha o codigo em TypeScript (96.3%+)
- Adicione testes para novas funcionalidades
- Siga o padrao de commit convencional
- Atualize a documentacao quando necessario
- Respeite a estrutura de design system

---

## REPORTAR PROBLEMAS

Encontrou um bug? Abra uma issue com:
- Descricao clara do problema
- Passos para reproduzir
- Versao do app (veja app.json)
- Versao do SO (Android/iOS)
- Screenshots (se aplicavel)

---

## ROADMAP

v1.0 (Atual - Lancado)
- Primeiros socorros completos
- Contatos de emergencia (5 servicos)
- Ligar direto para emergencia
- Localizacao com GPS de alta precisao
- Historico de localizacoes (SQLite)
- Offline-first com SQLite e AsyncStorage
- Acessibilidade implementada
- Termos e politica de privacidade

v1.1 (Proximas semanas)
- Compartilhamento expandido (WhatsApp, SMS, Email, Waze)
- Detector de conexao (NetInfo)
- Notificacoes locais de atualizacoes
- Modo dark
- Melhorias de performance

v2.0 (Proximos meses)
- Backend API para atualizacoes remotas
- Autenticacao opcional
- Cloud sync de historico
- Analytics anonimo
- Modo offline completo com dados versionados
- Push notifications

v3.0 (Futuro)
- Integracao com central de emergencia
- Compartilhamento automatico de localizacao
- Deteccao de queda/acidente
- Contacto de emergencia confiavel
- Relatorios de historico

---

## SUPORTE

Email: leoni.sousa@discente.ufj.edu.br

---

## LICENCA

Este projeto esta licenciado sob a Licenca MIT.

MIT License

Copyright (c) 2024-2026 Leoni Alves

Permissao e concedida, gratuitamente, a qualquer pessoa que obtenha uma copia
desta documentacao e dos arquivos associados para usar, copiar, modificar, mesclar,
publicar, distribuir, sublicenciar e/ou vender copias, sujeito as seguintes condicoes...

---

## CREDITOS

DESENVOLVEDOR
- Leoni Alves - Desenvolvedor principal

TECNOLOGIAS
- Expo
- React Native
- TypeScript

REFERENCIAS
- Ministerio da Saude - Nocoes de Primeiros Socorros
- ANVISA - Informacoes sobre Peconhentos
- Documentacao oficial do Expo e React Native

PROJETO DE EXTENSAO
Desenvolvido como projeto de extensao para o curso de Engenharia de Software pela UNOPAR EAD.

---

## STATUS DO PROJETO

Funcionalidade     : 100%
Testes            : 0% (Proxima prioridade)
Documentacao      : 98%
TypeScript        : 96.3%
Acessibilidade    : Implementada
Offline-First     : Completo
Persistencia      : SQLite + AsyncStorage
GPS e Mapas       : Google Maps + Historico

---

## ESTATISTICAS

- Linguagem Principal: TypeScript (96.3%)
- Linhas de Codigo: 2000+
- Commits: 20+
- Componentes: 10+
- Telas: 8
- Hooks Customizados: 3+
- Banco de Dados Local: SQLite + AsyncStorage
- Servicos de GPS: Expo Location (alta precisao)

---

Ultima atualizacao: 2026-03-17

Com amor para produtores rurais do Brasil

> **Com ❤️ para produtores rurais do Brasil**
