---
tags: [antigravity-conversa]
data: ""
steps: 121
fonte: Antigravity
---

# Sem título

> Configuração De Engenheiro IA


## Mensagens do usuário

"A partir de agora, atue como um Engenheiro de IA Especializado. Nosso fluxo de trabalho utiliza uma biblioteca centralizada de skills localizada na minha pasta atual.



Regras de Operação:



Indexação: Utilize o arquivo skills_index.json apenas como um catálogo de referência. Não tente processar todo o conteúdo dele de uma vez.



Consulta sob Demanda: Quando eu solicitar uma especialidade (ex: 'Preciso de um arquiteto' ou 'Use a skill zoom-automation'), você deve:

a) Buscar o path correspondente no skills_index.json.

b) Ler exclusivamente o arquivo .md localizado nesse path.

c) Incorporar apenas as diretrizes daquela skill no seu contexto de trabalho atual.



Gestão de Memória: Se a tarefa for complexa e envolver múltiplas skills, ative uma por vez. Caso o histórico da conversa fique longo, faça um 'Checkpoint' (resumo do progresso) e limpe o contexto para manter a performance.



Confirme se você entendeu a estrutura da pasta e o skills_index.json. Se sim, aguarde minha primeira instrução de especialidade." 
VocÊ consegue listar quais os tipos de skill existem no meu arquivo? Quando eu precisar delas, como posso requisitar?



Gere para mim algum jeito de tornar isso um agente autônomo para que as ações sejam feitas de forma automática. 
SIM
Olá, Agente. Preciso configurar meu ambiente de desenvolvimento para acessar a biblioteca de skills globalmente. Siga estas instruções para implementar o link de acesso (Junction Point) no meu Windows:

Definição de Caminhos:

Origem (Pasta das Skills): [INSIRA O CAMINHO DA PASTA ONDE VOCÊ BAIXOU AS SKILLS]

Destino (Pasta Global do Antigravity): C:\Users\%USERNAME%\.gemini\antigravity\skills

Procedimento:

Verifique se o diretório de destino (C:\Users\%USERNAME%\.gemini\antigravity\skills) existe. Se não, crie-o.

Utilize o comando mklink /J "Destino" "Origem" para criar o Ponto de Junção.

Validação:

Após criar o link, liste o conteúdo da pasta global para confirmar que todas as skills estão visíveis.

Verifique a integridade de um arquivo de teste (ex: brainstorming/README.md ou similar).

Nota de Segurança: Por favor, execute esta operação apenas se o caminho de destino for dentro da minha pasta de usuário, garantindo que não precise de privilégios de administrador."


SO PARA SABER, VOCE GEROU UM PLANO DE IMPLEMENTAÇÃO PARA QUE O AGENTE FUNCIONE DA FORMA CORRETA?
MAS SE EU INICIAR UM NOVO PROJETO OU VOLTAR A UM PROJETO EXISTENTE, VAI ESTA FUNCIONANDO O AGENTE AUTONOMO DAS SKILL E VAI TER ACESSO AS SKILL ESPECIFICARS PARA O PROJETO AUTOMATIVAMENTE, SEM TER QUE LER TUDO?
POR FAVOR CORRIGE PARA MIM
AGORA AS SKILL QUE JA EXISTIA NO PROJETO, E AS QUE FOI CRIADA ESPECIFICA, VOCE CONSEGUE LER, ADICIONAR A REGRA DE USO E MOVER ELA PARA A GLOBAL, DA PRA CRIAR ESSA REGRA, PARA QUE EU NÃO PERCA O QUE JA FOI FEITO ESPECIFICO PARA O PROJETO?
SIM
AGORA PENSA COMIGO, TEMOS ISSO TUDO ORQUESTRADO, MAS COMO GARANTIR QUE NÃO VAI LER NADA SEM NECESSIDADE? EXEMPLO, EU TENHO 1000 SKILL E O PROJETO COM SUA AJUDA, VAI PRECISARAPENAS UMAS 4, COMO TER CERTEZA QUE NÃO VAI LER AS MIL E GASTAR TOKENS E COTAS DESNECESSARIA?
MAS SE NESSA REGRA VOCE ENTENDER QUE PRECISA DE ALGO QUE NÃO TEM ALI?
SIM, PODE FAZER
AGORA SO MAIS UMA COISA, SE EU TE PEDIR PARA OLHAR UM REPOSITORIO, NO CASO UM PROJETO EXISTENTE, CONSEGUE VERIFICAR QUAIS SKILL EU JA UTILIZEI? AQUI POR EXEMPLO: E:\ZapSender
AGORA UMA PERGUNTA, A CADA LAYOUTE, CORES USADA, TIPOS DE BOTOES, É GERADO UMA SKILL ESPECIFICA PARA O PROJETO, PARA QUE CADA PAGINA NÃO SEJA CRIADA DE FORMA DIFERENTE? VOCE CONSEGUE GERAR A SKILL BASE DO PROJETO COM ESSAS INFORMAÇEOS? NÃO SEI SE ME ENTENDEU.
SIM, QUERO, E QUERO QUE CRIA A LISTA DAS SKILL IGUAL SUGERIU ANTERIOMENTE
AGORA EU POSSO FECHAR AQUI E ABRIR O ZAPSENDER QUE VAI ESTA TUDO ALINHADO E VAI ENTENDER TODO O CONTEXTO DAS SKILL?
SE UEU PEDIR PARA ELE AJUSTAR TODAS AS PAGINAS, ELE VAI FAZER? POIS TEM OS TEMAS, CADA TEM TEM SUA PALETA DE CORES, E ALGUAS PAGINAS MISTUROU, ELE VAI CORRIGIR PERFEITAMENTE?
