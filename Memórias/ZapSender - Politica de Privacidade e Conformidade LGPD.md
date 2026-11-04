# 🛡️ ZapSender - Política de Privacidade e Conformidade LGPD

* **Data de Vigência:** 31 de Outubro de 2026
* **Versão Documental:** `v3.6.94-LGPD`
* **Rota Pública:** [`/politica-de-privacidade`](file:///e:/ZapSender/apps/web/src/app/politica-de-privacidade/page.tsx) (Redirecionamento automático a partir de `/privacy`)
* **Responsável Legal e DPO:** Alex Buzatto Sarmento (`dpo@zapsender.com.br`)

---

## ⚖️ 1. Fundamentação Jurídica & LGPD (Lei nº 13.709/2018)

1. **Bases Legais de Tratamento (Art. 7º da LGPD):**
   * **Inciso V (Execução de Contrato):** Para viabilizar a criação de contas, autenticação e envio de mensagens solicitadas pelo cliente.
   * **Inciso IX (Legítimo Interesse):** Para aperfeiçoamento da plataforma, segurança anti-fraude e métricas de desempenho.
   * **Inciso II (Cumprimento de Obrigação Legal):** Manutenção de logs de conexão e acesso conforme determinado pelo Marco Civil da Internet (Lei nº 12.965/2014, Art. 15).

2. **Direitos Assegurados ao Titular (Art. 18 da LGPD):**
   * Confirmação da existência de tratamento e acesso aos dados cadastrais.
   * Correção imediata de dados incompletos, inexatos ou desatualizados.
   * Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.
   * Portabilidade dos dados em formatos padronizados (CSV / JSON).
   * Revogação do consentimento e desconexão de instâncias a qualquer momento.

---

## 📱 2. Ecossistema Meta & WhatsApp

* **Papel de Operador Tecnológico:** O cliente contratante do ZapSender atua como o **Controlador** das suas próprias bases de contatos e listas de leads. O ZapSender opera estritamente como **Operador**, executando os disparos a comando do cliente.
* **Isolamento de Sessões:** Conexão efetuada por chaves de pareamento cifradas (QR Code / Pairing Code) com sessões voláteis e isoladas.
* **Política Anti-Spam e Opt-In Mandatório:** É dever contratual do usuário possuir consentimento prévio e legítimo (opt-in) de todos os contatos da lista. Práticas de spam em massa indiscriminado são estritamente proibidas e sujeitas a suspensão sumária de conta.

---

## 🤖 3. Inteligência Artificial (Vulcano Copiloto / Sentinel)

* **Privacidade Corporativa Estrita:** As requisições direcionadas para os modelos de LLM (OpenAI, Anthropic Claude, Google Gemini e Groq) são enviadas sob credenciais de API corporativa cujos contratos garantem que os dados e conversas **NÃO são utilizados para treinar ou aprimorar modelos públicos de terceiros**.
* **Vulcano Sentinel:** Algoritmo defensivo voltado à proteção de instâncias contra bloqueios de operadoras (mitigação de falsos positivos via variações semânticas e intervalo dinâmico humanizado).

---

## 🎬 4. Fábrica de Vídeos com IA (SupoClip) & Fair Use

* **Armazenamento Transitório:** Downloads e extração de áudio/vídeo são mantidos em volumes voláteis efêmeros apenas pelo tempo necessário para execução do FFmpeg e Whisper. Arquivos temporários são descartados rotineiramente.
* **Atribuição Obrigatória ao Criador Original:** Em publicações de curadoria e repost, o sistema injeta e exige a menção de autoria (`@autor` e URL de origem), respeitando a legislação de direitos autorais e o fair use (uso legítimo informativo/educacional).
* **Conformidade com APIs de Terceiros:** Adesão total aos Termos de Serviço do YouTube e à Política de Privacidade do Google para usuários que conectarem canais do YouTube Studio.

---

## 🔐 5. Segurança da Informação

* **Criptografia em Trânsito:** Protocolo TLS 1.3 obrigatório em todas as rotas web e endpoints de API.
* **Senhas:** Criptografadas com hash irreversível bcrypt + salting criptográfico.
* **Isolamento Multi-Tenant:** Segregação lógica rígida por `organizationId` em todas as tabelas do PostgreSQL via Prisma.

