# 🚑 SOS Campo

> **Orientação rápida e resgate de emergências no campo, com ou sem internet**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-96.3%25-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/Built%20with-Expo-black.svg)](https://expo.dev)

---

## 📖 Sobre o Projeto

**SOS Campo** é um aplicativo mobile educativo desenvolvido para **funcionar com ou sem internet**, permitindo que produtores rurais acessem informações críticas de primeiros socorros e emergências, mesmo em áreas com conectividade limitada.

### Por quê?
- 🌾 **Ambiente Rural**: Regiões agrícolas frequentemente têm sinal fraco
- 🏥 **Emergências**: Informações críticas precisam estar sempre disponíveis
- ⏱️ **Tempo é Ouro**: Cada segundo conta em uma emergência
- 📱 **Acessibilidade**: Interface clara e intuitiva para situações de stress

---

## ✨ Principais Funcionalidades

### 🆘 Primeiros Socorros
- Guia ilustrado de primeiros socorros para acidentes comuns
- Passos claros e objetivos
- Avisos sobre o que **NÃO** fazer
- Referências de fontes oficiais (Ministério da Saúde, ANVISA)

### 📞 Emergências
Acesso direto a contatos essenciais:
- **SAMU**: 192
- **Bombeiros**: 193
- **Polícia Militar**: 190
- **Polícia Rodoviária Federal**: 191
- **Disque Intoxicação (ANVISA)**: 0800 722 6001

### 📍 Compartilhamento de Localização
- Obter GPS em alta precisão
- Compartilhar coordenadas via:
  - WhatsApp
  - SMS
  - Email
  - Google Maps
  - Waze
  - Copiar para clipboard

### 💾 Histórico Local
- Armazenar localizações capturadas
- Banco de dados SQLite local
- Acessar sem internet
- Sincronizar quando online

### 📊 Calculadora de IMC
- Ferramenta rápida para cálculo
- Fácil interpretação de resultados

### 📋 Informações Legais
- Termos de Uso
- Política de Privacidade
- Fontes e Referências

---

## 🏗️ Arquitetura

### Offline-First Design
```
┌─────────────────────────────────────┐
│   CAMADA DE PERSISTÊNCIA LOCAL      │
├─────────────────────────────────────┤
│                                     │
│  🗄️ AsyncStorage                   │
│     └─ Armazenamento simples        │
│        (localização recente)        │
│                                     │
│  🗄️ SQLite Database                │
│     └─ Histórico de localizações   │
│        └─ CRUD completo             │
│                                     │
│  📄 Constants (Bundled)            │
│     └─ Primeiros socorros          │
│     └─ Números de emergência       │
│     └─ Dados estáticos             │
│                                     │
└─────────────────────────────────────┘
         ⬇️ COM INTERNET ⬇️
┌─────────────────────────────────────┐
│   COMPARTILHAMENTO & SERVIÇOS       │
├─────────────────────────────────────┤
│                                     │
│  📱 WhatsApp / SMS / Email         │
│  🗺️  Google Maps / Waze            │
│  📤 Share API Nativa               │
│                                     │
└─────────────────────────────────────┘
```

### Tech Stack

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React Native** | v0.76+ | Framework mobile |
| **Expo** | Latest | Runtime & Build |
| **Expo Router** | Latest | Navegação |
| **TypeScript** | 5.0+ | Type safety (96.3%) |
| **SQLite** | expo-sqlite | Persistência local |
| **AsyncStorage** | @react-native-async-storage | Cache rápido |
| **Expo Location** | Latest | Serviços de GPS |

---

## 📂 Estrutura do Projeto

```
sos-campo/
├── app/                           # 📱 Telas (Expo Router)
│   ├── _layout.tsx               # Layout raiz
│   ├── SOS_Campo/                # Navegação principal (Tabs)
│   │   ├── index.tsx             # Home
│   │   ├── acidentes.tsx         # Primeiros socorros
│   │   ├── emergencia.tsx        # Emergências & localização
│   │   ├── calculadora.tsx       # IMC Calculator
│   │   └── _layout.tsx           # Tab navigation
│   ├── acidente/[id].tsx         # Detalhe do acidente
│   └── legal/                    # Páginas legais
│       ├── termos.tsx
│       ├── privacidade.tsx
│       └── fontes.tsx
│
├── components/                    # 🧩 Componentes Reutilizáveis
│   ├── LocationShare.tsx         # Widget de localização
│   ├── ShareLocationModal.tsx    # Modal de compartilhamento
│   └── ...
│
├── hooks/                         # 🎣 Custom Hooks
│   ├── useLocationDatabase.ts    # SQLite CRUD
│   ├── useResponsive.ts          # Responsividade
│   └── ...
│
├── utils/                         # 🔧 Utilitários
│   ├── locationStorage.ts        # AsyncStorage helpers
│   ├── locationSharing.ts        # Compartilhamento
│   └── ...
│
├── constants/                     # 📌 Dados Estáticos
│   ├── theme.ts                  # Design system
│   ├── acidentes.ts              # DB de acidentes
│   └── ...
│
├── assets/                        # 🖼️ Imagens & Ícones
│   └── images/
│
├── app.json                       # Configuração Expo
├── package.json                   # Dependências
├── tsconfig.json                  # TypeScript config
└── README.md                      # Esta documentação
```

---

## 🚀 Como Começar

### ✅ Pré-requisitos
- **Node.js** 18+ ou **Yarn**
- **Expo CLI** (opcional, usa npx)
- **Mobile Device** com Expo Go instalado (ou emulador)

### 📥 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/LeoniAlvesD/sos-campo.git
cd sos-campo
```

2. **Instale dependências**
```bash
npm install
# ou
yarn install
```

3. **Inicie o desenvolvimento**
```bash
npm start
# ou
npx expo start
```

4. **Visualize no seu dispositivo**

**Opção 1: Expo Go** (Recomendado para testes)
- Baixe o app "Expo Go" na Play Store ou App Store
- Escaneie o QR code no terminal

**Opção 2: Build Local**
```bash
# iOS (macOS apenas)
npm run ios

# Android
npm run android
```

### 🏗️ Build para Produção

```bash
# Build APK (Android)
eas build --platform android --local

# Build IPA (iOS)
eas build --platform ios --local

# Build Universal
eas build
```

---

## 💾 Persistência de Dados

### AsyncStorage
Armazena dados simples e rápidos:
```typescript
import { saveLocation, getLocation } from '@/utils/locationStorage';

// Salvar
await saveLocation({ latitude: -15.7975, longitude: -47.8919 });

// Recuperar
const location = await getLocation();

// Remover
await removeLocation();
```

### SQLite (Histórico)
Banco de dados local para histórico de localizações:
```typescript
import { createTable, insertLocation, getLocations } from '@/hooks/useLocationDatabase';

// Criar tabela (automático na primeira execução)
await createTable();

// Inserir localização
await insertLocation(-15.7975, -47.8919, 10.5, new Date().toISOString());

// Recuperar histórico
const locations = await getLocations();

// Deletar localização
await deleteLocation(locationId);
```

---

## 📝 Funcionalidades Offline vs Online

| Funcionalidade | Offline | Online |
|---|---|---|
| Ver primeiros socorros | ✅ | ✅ |
| Acessar números de emergência | ✅ | ✅ |
| Obter localização (GPS) | ✅ | ✅ |
| Ver histórico de localizações | ✅ | ✅ |
| Calcular IMC | ✅ | ✅ |
| Compartilhar via WhatsApp | ❌ | ✅ |
| Compartilhar via SMS/Email | ❌ | ✅ |
| Abrir Google Maps/Waze | ❌ | ✅ |
| Compartilhar via Share API | ❌ | ✅ |

---

## 🎨 Design System

Cores e espaçamento centralizados em `constants/theme.ts`:

```typescript
export const theme = {
  colors: {
    primary: '#1F4D3A',      // Verde (principal)
    secondary: '#FFFFFF',     // Branco
    danger: '#DC2626',        // Vermelho (emergência)
    emphasis: '#F59E0B',      // Laranja (destaque)
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
```

---

## ♿ Acessibilidade

✅ Implementada em todo o app:
- **accessibilityLabel**: Descrições para leitores de tela
- **accessibilityRole**: Identificação de elementos
- **Cores contrastadas**: WCAG AA compliance
- **Tamanho de fonte**: Legível em todos os dispositivos
- **Touch targets**: Mínimo 44x44pt para toque

---

## 📚 Documentação de Dados

### Estrutura de Acidente
```typescript
interface Acidente {
  id: string;
  nome: string;                    // Ex: "Picada de cobra"
  descricao: string;               // Descrição breve
  passos: string[];                // Ações a tomar
  naoFazer: string[];              // Avisos
  referencias?: string;            // Links para mais info
}
```

### Estrutura de Localização (SQLite)
```typescript
interface Location {
  id: number;                      // PK Autoincrement
  latitude: number;
  longitude: number;
  accuracy: number | null;         // Precisão em metros
  timestamp: string;               // ISO 8601
}
```

---

## 🧪 Testes

Preparação para adicionar testes:

```bash
# Instalação de dependências de teste
npm install --save-dev jest @testing-library/react-native

# Executar testes
npm test
```

---

## 🔒 Segurança & Privacidade

✅ **Política de Privacidade**
- Nenhum dado pessoal é coletado
- Nenhuma informação é enviada para servidor
- Tudo fica local no dispositivo

✅ **Conformidade**
- Lei Geral de Proteção de Dados (LGPD)
- Documentado em `/legal/privacidade.tsx`

---

## 📱 Requisitos do Sistema

### Android
- Versão: 7.0+ (API 24+)
- Permissões necessárias:
  - `ACCESS_FINE_LOCATION`
  - `ACCESS_COARSE_LOCATION`
  - `CALL_PHONE`
  - `SEND_SMS`

### iOS
- Versão: 14.0+
- Permissões necessárias:
  - `NSLocationWhenInUseUsageDescription`
  - `NSPhotoLibraryUsageDescription`

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o repositório
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Diretrizes
- Mantenha o código em TypeScript (96.3%+)
- Adicione testes para novas funcionalidades
- Siga o padrão de commit convencional
- Atualize a documentação

---

## 🐛 Reportar Problemas

Encontrou um bug? Abra uma [issue](https://github.com/LeoniAlvesD/sos-campo/issues) com:
- Descrição clara do problema
- Passos para reproduzir
- Versão do app e SO
- Screenshots (se aplicável)

---

## 📋 Roadmap

### ✅ v1.0 (Atual)
- [x] Primeiros socorros
- [x] Contatos de emergência
- [x] Localização & compartilhamento
- [x] Calculadora IMC
- [x] Offline-first com SQLite

### 🔄 v1.1 (Próximas versões)
- [ ] Detector de conexão (NetInfo)
- [ ] Sincronização automática
- [ ] Notificações push
- [ ] Modo dark
- [ ] Multi-idioma (i18n)

### 🚀 v2.0 (Futuro)
- [ ] Backend API
- [ ] Autenticação
- [ ] Cloud sync
- [ ] Histórico na nuvem
- [ ] Analytics anônimo

---

## 📞 Suporte

- 📧 **Email**: leoni.sousa@discente.ufj.edu.br
- 🐙 **GitHub Issues**: [Abra uma issue](https://github.com/LeoniAlvesD/sos-campo/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/LeoniAlvesD/sos-campo/discussions)

---

## 📜 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2024-2026 Leoni Alves

Permissão é concedida, gratuitamente, a qualquer pessoa que obtenha uma cópia
desta documentação e dos arquivos associados para usar, copiar, modificar, mesclar,
publicar, distribuir, sublicenciar e/ou vender cópias, sujeito às seguintes condições...
```

---

## 👏 Créditos

### Desenvolvedor
- **Leoni Alves** (@LeoniAlvesD) - Desenvolvedor principal

### Tecnologias
- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [TypeScript](https://www.typescriptlang.org)

### Referências
- Ministério da Saúde - Noções de Primeiros Socorros
- ANVISA - Informações sobre Peçonhentos
- Documentação oficial do Expo & React Native

### Projeto de Extensão
Desenvolvido como projeto de extensão para o curso de **Engenharia de Software** pela **UNOPAR EAD**.

---

## 📊 Status do Projeto

```
├─ Funcionalidade     : ✅ 100%
├─ Testes            : ⚠️  0% (Próxima prioridade)
├─ Documentação      : ✅ 95%
├─ TypeScript        : ✅ 96.3%
├─ Acessibilidade    : ✅ Implementada
└─ Offline-First     : ✅ Completo
```

---

## 📈 Estatísticas

- **Linguagem Principal**: TypeScript (96.3%)
- **Linhas de Código**: ~2000+
- **Commits**: 20+
- **Componentes**: 10+
- **Telas**: 8
- **Hooks Customizados**: 3+

---

**Última atualização**: 2026-03-17

---

> **Com ❤️ para produtores rurais do Brasil**
