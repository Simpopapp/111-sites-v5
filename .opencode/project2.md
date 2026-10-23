# Project 2 — VibeCoder Academy: de catálogo de conceitos a ambiente de aprendizagem aplicada

> **Natureza:** planejamento central de evolução do produto: o que precisa melhorar, por que isso importa e qual experiência queremos construir.
> **Base examinada:** `project1.md`, `prd-project1.md`, catálogo real, páginas existentes, lógica e interfaces dos seis simuladores; observação das quatro páginas atuais em desktop e do laboratório de filas no celular.
> **Limite desta rodada:** este é o único arquivo de entrega. Não é PRD, roadmap, autorização para implementar ou planejamento de login, segurança operacional ou infraestrutura.
> **Status das afirmações:** o diagnóstico descreve a base observada; as direções seguintes são propostas, não funcionalidades existentes nem resultados comprovados com alunos.

## 1. A mudança central

A primeira versão organizou 111 termos, explicações acessíveis, riscos, sugestões de solução, seis demonstrações e um checklist. Ela funciona como porta de entrada e referência rápida. Ainda não entrega uma metodologia suficiente para aprender a reconhecer problemas, escolher soluções, justificar trade-offs, testar hipóteses e transferir o raciocínio para situações novas.

O Project 2 deve transformar a Academy em um **ateliê de raciocínio sobre software**, não em uma lista maior de definições nem em um painel mais vistoso. O aluno precisa sair de “reconheço esse termo” para “sei identificar quando isso importa, explicar o mecanismo, comparar alternativas e demonstrar uma decisão adequada”.

A unidade principal de valor deixa de ser o conceito consumido e passa a ser a **decisão aprendida**. Os conceitos continuam identificáveis e consultáveis, mas passam a integrar problemas, experimentos, explicações, exercícios e revisões coerentes.

**Promessa desejada:** ajudar quem constrói software a entender o comportamento de sistemas e tomar decisões proporcionais ao seu contexto, com prática verificável e explicações rigorosas.

**Promessas que não devemos fazer:** certificar que um aplicativo está pronto para produção, equiparar leitura a competência, prometer domínio por completar 111 itens ou apresentar resultados simulados como medições de sistemas reais.

## 2. Fronteiras do planejamento

- A evolução concentra-se em metodologia, qualidade editorial, jornadas, interfaces desenhadas por assunto, prática, feedback, personalização e continuidade do aprendizado.
- Não incluir cadastro, login, permissões, endurecimento de segurança, serviços operacionais, deploy de laboratório ou complexidade de infraestrutura como condições para o valor educacional.
- Temas já existentes como SQL Injection, IAM, Docker ou Kubernetes continuam sendo objetos de estudo; isso não significa implementar esses sistemas na Academy nem expandir sua infraestrutura.
- Não exigir chave de API, conta em fornecedor, instalação de ferramenta externa ou projeto próprio para realizar o percurso principal.
- Não depender de chatbot ou IA avaliadora para explicar respostas, recomendar percursos ou produzir conteúdo confiável. Essas capacidades devem ter valor pedagógico por si mesmas.
- Não converter cada sugestão deste documento automaticamente em funcionalidade obrigatória. O núcleo é indispensável; extensões só fazem sentido quando fortalecem uma lacuna real de aprendizagem.
- Preservar IDs e nomes canônicos dos 111 conceitos como referência histórica, sem tratar a ordem da transcrição como currículo nem suas analogias como autoridade técnica incontestável.
- Este documento é escrito em português. A base do produto está em inglês; tradução integral é uma decisão editorial futura, não uma mudança silenciosa determinada aqui.

## 3. Diagnóstico da experiência atual

| Base observada | Limitação concreta | Evolução necessária |
|---|---|---|
| Home com 111 cards, busca e 15 categorias. | O aluno recebe inventário antes de receber orientação; os seis laboratórios aparecem depois do catálogo e só quatro são destacados na home. | Entrada por intenção, continuidade visível e acesso imediato à prática; biblioteca completa continua disponível. |
| Modelo de conceito com `id`, nome, categoria, analogia, risco e solução. | Não há objetivo demonstrável, pré-requisitos, condições de aplicação, exercício ou critério de qualidade. | Contrato editorial-pedagógico mais profundo, com exemplos, contraexemplos e evidência. |
| Detalhe formado por três blocos textuais quase idênticos entre temas. | Um assunto de concorrência, um de rede e um de estatística recebem a mesma apresentação. | Estrutura pedagógica comum, representação central específica para o mecanismo de cada tema. |
| Navegação por anterior/próximo número. | Ordem canônica não explica dependência nem ajuda a resolver a dúvida atual. | Navegação por pré-requisito, contraste, continuação da missão e retorno ao contexto anterior. |
| Home anuncia inspeção de código e blueprints. | O detalhe examinado entrega textos curtos e não oferece esses materiais. | Alinhar promessa e entrega; exemplos de código e diagramas precisam existir onde forem prometidos. |
| Hub de sandboxes monta os seis laboratórios em uma longa página; `?s=` rola até um deles. | Abrir um experimento mantém vizinhos e contextos distintos na mesma superfície; não existe jornada completa por laboratório. | Separar descoberta de laboratório e experiência focada de experimentação, preservando links antigos. |
| Demonstrações acionadas por poucos botões, com resultados e logs. | O aluno observa comportamento sem precisar prever, interpretar ou justificar. | Experimentos com hipótese, comparação, explicação causal e desafio de transferência. |
| Checklist manual “Implemented in My App”, inclusive no card. | A ação principal incentiva autodeclaração antes da prática; marcar não demonstra conhecimento. | Separar estudo, domínio demonstrado e aplicação declarada. |
| Percentual calculado como marcados/111 e rótulo final “Mission ready”. | Peso uniforme e promessa de prontidão ignoram contexto, relevância e evidência. | Indicadores honestos por objetivo e competência, sem selo de prontidão operacional. |
| Readiness organiza nomes em listas sem acesso direto à aula. | Encontrar uma lacuna não conduz naturalmente a resolvê-la. | Cada lacuna deve abrir uma prática ou explicação específica e permitir retorno com resultado. |
| Superfícies escuras, muitos contornos arredondados, pequenos rótulos e pouco conteúdo visual substantivo. | A marca é reconhecível, mas os assuntos parecem intercambiáveis e a densidade favorece leitura de inventário. | Direção editorial e instrumental, com hierarquia forte, diagramas explicativos e menos caixas decorativas. |

As observações de tela não mostraram transbordamento horizontal nos recortes verificados. Isso não comprova acessibilidade, legibilidade de todos os estados ou qualidade de uso em todos os dispositivos; o problema central aqui é a arquitetura da experiência, não presumir defeitos de layout que não foram observados.

### 3.1. Lacunas de precisão que precisam orientar a revisão

1. **SQL Injection:** o modo concatenado devolve o mesmo veredito de ataque para qualquer entrada, e o parametrizado sempre afirma ausência de resultados. A demonstração não avalia semanticamente o que foi digitado. A precedência de operadores também torna a explicação atual do payload padrão inadequada para o bypass alegado.
2. **Pub/Sub + Queue:** a lógica atual é uma fila compartilhada, processada por um worker a cada passo. Isso demonstra consumidores competindo por trabalho, não entrega independente para vários assinantes. Falha aleatória de worker também não torna, por si só, uma mensagem “envenenada”.
3. **N+1:** a comparação usa números sintéticos fixos e trata JOIN como uma consulta de 14 ms. Não mede banco real, não demonstra uso de índice e não autoriza a conclusão “uma consulta sempre é melhor”.
4. **P99:** a geração probabilística não garante exatamente uma resposta na cauda; a legenda atual a descreve como se garantisse. Com nearest-rank e 100 observações, uma única resposta extrema pode afetar o máximo e não o P99. P99.9 com essa amostra pode coincidir com o máximo sem representar uma estimativa estável da população.
5. **Links conceito–laboratório:** Exponential Backoff está ligado ao token bucket, XSS e WAF ao SQL Injection, e índices ao N+1; proximidade temática não equivale a demonstração desses mecanismos.
6. **Analogias:** CAP como “escolha dois” precisa de contexto de partição; a analogia atual de deadlock pode sugerir livelock. Toda analogia precisa ser revista junto com a explicação técnica que pretende facilitar.

Esses pontos são prioridades de qualidade conceitual, não pedidos para executar correções nesta rodada. Um produto educativo profissional não pode ensinar uma certeza que seu próprio modelo não sustenta.

## 4. Princípios inegociáveis de evolução

### 4.1. Profundidade sem intimidação

Começar de forma acessível, mas não permanecer infantilizado. A analogia abre a porta; o mecanismo técnico, seus limites e sua aplicação precisam aparecer depois. O aluno nunca deve precisar escolher entre “explicação simples porém falsa” e “texto técnico incompreensível”.

### 4.2. Uma decisão antes de uma receita

Antes de apresentar a solução, mostrar contexto, sintoma e restrições. Perguntar o que o aluno faria e por quê. O conhecimento de uma ferramenta não deve substituir a compreensão do problema.

### 4.3. Evidência acima de atividade

Tempo na página, cliques, itens visitados, streaks e animações não demonstram aprendizagem. Previsões, diagnósticos, justificativas, resultados e transferência são evidências mais úteis.

### 4.4. Consistência sem uniformização

Navegação, tipografia, controles e estados devem ser consistentes. O espaço central de aprendizagem não: filas pedem rastreamento de eventos; percentis pedem distribuição; concorrência pede sequenciamento; incidentes pedem investigação.

### 4.5. Complexidade proporcional ao problema

Ensinar também quando não usar um padrão. Um monólito simples, uma consulta em lote ou uma política conservadora podem ser escolhas melhores que a arquitetura mais sofisticada. Não premiar quantidade de tecnologias inseridas na solução.

### 4.6. Liberdade com orientação

Percursos sugeridos não bloqueiam consulta direta. O iniciante recebe apoio; o experiente pode demonstrar o que sabe e avançar; quem quer referência entra e sai sem ser forçado a um curso inteiro.

### 4.7. Honestidade do modelo

Cada laboratório explicita o que simula, o que omite, como seus números são obtidos e quais conclusões não podem ser tiradas. Aproximação didática deve ser reconhecida como aproximação.

## 5. Público, necessidades e modos de entrada

Não reduzir o público a um perfil único de “vibe coder”. A experiência precisa acolher quatro necessidades, sem criar quatro produtos separados.

| Intenção | Necessidade real | Entrada desejada | Resultado esperado |
|---|---|---|---|
| “Estou começando e os nomes me confundem.” | Construir fundamentos sem afogamento em jargão. | Problema curto e percurso introdutório contextual. | Explicar mecanismos básicos e reconhecer situações em que importam. |
| “Meu aplicativo apresenta um sintoma.” | Conectar observação a hipóteses e decisões. | Busca por problema: lentidão, duplicação, fila crescente, dado desatualizado. | Diagnosticar possibilidades e escolher uma próxima verificação, sem promessa de reparar automaticamente o app. |
| “Já conheço parte disso.” | Praticar decisões mais difíceis sem reler tudo. | Desafio inicial com justificativa e variante. | Identificar lacunas reais e estudar apenas os apoios necessários. |
| “Quero consultar um detalhe.” | Encontrar definição, comparação, exemplo e limites rapidamente. | Biblioteca e busca direta. | Sair com uma resposta precisa, sem falsa contabilização de domínio. |

A home deve apresentar uma ação principal coerente com o estado do aluno: começar uma missão, continuar uma atividade interrompida ou revisar uma lacuna. Não deve mostrar cinco ações igualmente urgentes nem converter o primeiro acesso em um formulário longo.

## 6. Metodologia de aprendizagem

### 6.1. Ciclo completo

**Contextualizar → diagnosticar → prever → explicar → experimentar → interpretar → decidir → transferir → revisar.**

- **Contextualizar:** apresentar um sistema pequeno, um sintoma e as restrições relevantes.
- **Diagnosticar:** recolher uma decisão inicial e, quando útil, uma indicação de confiança. Não usar isso para rotular a pessoa.
- **Prever:** pedir uma previsão antes de revelar o resultado; reduzir o risco de o aluno apenas concordar com a resposta pronta.
- **Explicar:** construir o modelo mental, mostrar um exemplo resolvido e apontar os limites da analogia.
- **Experimentar:** alterar uma condição identificável; a ligação entre intervenção e resultado precisa ser visível.
- **Interpretar:** relacionar resultado a mecanismo, comparando previsão, observação e surpresa.
- **Decidir:** resolver uma variante sem indicar qual padrão usar; admitir alternativas válidas quando respeitam as restrições.
- **Transferir:** reaplicar o princípio em outro domínio ou com uma restrição nova.
- **Revisar:** recuperar o raciocínio depois de um intervalo, não apenas reler o texto.

Nem toda consulta percorre o ciclo inteiro. Uma missão de aprendizagem precisa cobri-lo em escala apropriada; uma página de referência precisa permitir entrar em seus pontos relevantes.

### 6.2. Apoio graduado

Combinar exemplo resolvido, prática parcialmente guiada e desafio independente. As pistas devem ter níveis: apontar o que observar; indicar a relação importante; mostrar parte do raciocínio; só depois revelar uma solução comentada.

A evidência registra quanto apoio foi usado. Uma resposta correta depois da solução revelada não deve receber o mesmo significado de uma decisão independente. Nova tentativa pode consolidar entendimento, mas precisa de uma variante para não medir apenas memória imediata.

### 6.3. Tipos de exercício

- Prever o próximo estado ou a consequência de uma configuração.
- Ordenar eventos e identificar onde uma suposição deixa de valer.
- Comparar duas soluções com o mesmo cenário e justificar uma escolha.
- Encontrar uma hipótese não sustentada por um gráfico, log ou trecho de código.
- Corrigir uma decisão e observar qual invariante passa a ser preservada.
- Escolher qual informação adicional seria necessária antes de recomendar uma arquitetura.
- Explicar por que uma solução conhecida é desnecessária ou inadequada naquele contexto.
- Transferir o mecanismo para uma situação em que os nomes e a interface mudam.

Evitar exercícios cuja resposta esteja explícita no nome do botão, perguntas puramente vocabulares e alternativas falsas caricaturais. Avaliar raciocínio sem exigir prosa longa em toda interação.

## 7. Modelo de conteúdo: cada conceito precisa ensinar de verdade

O modelo a seguir é um contrato editorial, não uma estrutura técnica fechada. A profundidade varia conforme o tema; nenhuma seção deve virar preenchimento obrigatório sem utilidade.

| Camada | Conteúdo necessário | Pergunta que deve responder |
|---|---|---|
| Identidade | Nome, referência canônica, problema e posição no mapa de aprendizagem. | “Sobre o que é isso e por que estou aqui?” |
| Objetivo | Ação observável em um contexto definido. | “O que conseguirei fazer depois?” |
| Pré-requisitos | Conhecimentos necessários e atalhos para retomá-los. | “O que preciso compreender antes?” |
| Modelo mental | Definição, analogia, correspondências e limites. | “Como o mecanismo funciona?” |
| Cenário concreto | Sistema, dados, sintoma, restrições e baseline. | “Onde isso aparece de forma reconhecível?” |
| Representação | Diagrama, tabela, linha do tempo, consulta, código ou gráfico apropriado. | “O que devo observar para entender a causa?” |
| Exemplo trabalhado | Decisão e raciocínio intermediário, não só solução final. | “Como alguém chega a uma escolha defensável?” |
| Contraste | Alternativas, trade-offs e situação em que não usar. | “O que muda se eu escolher outra abordagem?” |
| Equívocos | Erros comuns e contraexemplos discriminantes. | “Que entendimento aparentemente correto pode me enganar?” |
| Prática | Previsão, experimento e desafio independente. | “Consigo aplicar sem copiar?” |
| Evidência | Critérios, resultado e ajuda utilizada. | “O que sustenta dizer que aprendi?” |
| Transferência e revisão | Variante e recuperação posterior. | “Sei usar fora deste exemplo e ainda lembro depois?” |
| Proveniência | Referências, revisão e limites do modelo. | “Por que confiar nesta explicação?” |

### 7.1. Código, diagramas e materiais de apoio

Código deve mostrar entradas, saídas, comportamento e motivo da alteração. Exemplos antes/depois precisam trabalhar a mesma situação, destacar o trecho decisivo e distinguir pseudocódigo, código executável e fragmento ilustrativo.

Não publicar snippets quebrados como “prontos para copiar”. Quando dependerem de contexto ausente, explicar a dependência. Não usar nomes de fornecedores como substituto para explicar o padrão. Exemplos específicos podem existir depois que o mecanismo estiver claro.

Diagramas precisam de entidades nomeadas, direção e significado das conexões, legenda e versão textual equivalente. Um desenho de caixas não é um blueprint se não explica comportamento ou decisão.

Materiais reutilizáveis devem ser consequência do estudo: ficha de decisão, comparação de alternativas, relatório de experimento, explicação de um incidente e perguntas de verificação para o próprio projeto. Evitar uma coleção de PDFs e resumos que apenas repete a aula.

### 7.2. Qualidade editorial

Separar definição de recomendação. “Timeout” não significa “falha confirmada”; “parametrizado” não significa “nenhuma linha retornada”; “menos queries” não significa “melhor desempenho em toda situação”; “backups existem” não significa “restauração funciona”.

Auditar os 111 conceitos por correção, pré-requisitos, cobertura prática, equívocos e relevância contextual. Os textos gerados a partir da fonte precisam de uma estratégia editorial coerente para que melhorias não sejam perdidas numa regeneração posterior; a escolha técnica cabe ao PRD futuro.

## 8. Organização do conhecimento

### 8.1. Três portas para o mesmo acervo

1. **Biblioteca de referência:** conceitos, definições, comparações e exemplos consultáveis.
2. **Percursos por problema ou competência:** sequência argumentada de aulas e práticas.
3. **Laboratórios e missões:** tarefas em que o aluno investiga, manipula e decide.

As portas convergem no mesmo conhecimento. Não criar três versões divergentes da mesma explicação nem contar a mesma visita três vezes como progresso.

### 8.2. Relações com significado

As conexões devem distinguir **pré-requisito**, **contraste**, **composição**, **apoio contextual** e **prática direta**. “Relacionado” sozinho informa pouco e hoje pode sugerir uma cobertura inexistente.

Exemplo: timeout e idempotência compõem uma decisão sobre repetir uma operação; rate limiting e backoff se relacionam, mas um token bucket não ensina por si só política de repetição; JOIN e índice são mecanismos diferentes que podem coexistir.

Mapa visual é útil como visão complementar, não como única navegação. Uma lista legível deve oferecer as mesmas relações, inclusive no celular e para tecnologias assistivas.

### 8.3. Percursos exemplares

- **A requisição não terminou:** latência → timeout → incerteza do resultado → retry → backoff → idempotência → circuit breaker.
- **A página ficou lenta:** round-trips → N+1 → consulta em lote/JOIN → índice → volume retornado → caching → invalidação → percentis.
- **O trabalho está acumulando:** fila → capacidade de processamento → competing consumers → backpressure → retry → DLQ → recuperação.
- **O dado parece contraditório:** concorrência → race condition → locks → replicação → consistência → partição → limites das escolhas.
- **Precisamos mudar sem quebrar clientes:** versão de API → compatibilidade → schema → migração → estratégia de release → rollback.
- **Algo deu errado e precisamos aprender:** sinais → investigação → hipótese → ação → verificação → postmortem sem culpabilização.

Esses percursos são propostas pedagógicas, não fases de execução. Cada um precisa declarar seu resultado, permitir consulta livre e justificar a inclusão dos conceitos.

## 9. Replanejamento das telas

### 9.1. Home: ponto de trabalho, não mural de termos

**Função:** orientar uma ação útil em poucos segundos.

Primeiro acesso: identidade da VibeCoder Academy claramente visível, escolha leve entre começar por um problema e explorar a biblioteca, uma missão introdutória concreta e acesso evidente aos laboratórios. O acervo aparece como recurso, não como obrigação de varrer 111 cards.

Retorno: atividade em andamento com etapa específica, uma revisão pertinente e acesso ao objetivo escolhido. “Continuar” deve retornar à tarefa e ao estado significativo, não apenas à página geral.

Substituir discurso sobre “milhão de usuários” por problemas reconhecíveis e proporcionais ao público. Manter texto de orientação curto; demonstrar o valor com a atividade, não com uma lista de funcionalidades.

### 9.2. Biblioteca: descobrir e encontrar

Busca por termo, sigla, sinônimo, sintoma e pergunta. Resultados precisam explicar o motivo da correspondência, diferenciar aula, comparação e laboratório e sugerir refinamento quando houver ambiguidade.

Categoria, dificuldade, tipo de prática e estado de estudo são filtros possíveis; só os mais úteis devem aparecer inicialmente. Não expor todas as dimensões como uma parede de pills. Estado vazio deve oferecer limpar filtros, revisar a consulta ou explorar um tema relacionado.

Cards passam a mostrar problema/objetivo, nível e tipo de experiência. A ação principal é estudar ou praticar. Marcação de “implementado” não deve disputar o clique de abertura nem figurar como conclusão pedagógica.

Voltar de uma aula preserva consulta, filtros e posição na lista. IDs canônicos continuam encontráveis, mas não precisam dominar a hierarquia visual.

### 9.3. Visão de percurso: compromisso compreensível

Mostrar problema central, resultado final, conhecimentos necessários, etapas e produto de aprendizagem. Estimativa de duração deve ser apresentada como estimativa e depois calibrada com uso real.

O aluno pode consultar uma etapa, retomar uma lacuna ou demonstrar conhecimentos prévios. Não bloquear todo o conteúdo por um pré-requisito; explicar o risco de avançar sem ele e oferecer recuperação curta.

### 9.4. Aula de conceito: uma oficina específica

Abrir com nome literal do conceito, problema, objetivo e acesso ao ponto relevante. O centro da página recebe o instrumento do tema; explicações, código, contraste e prática acompanham o raciocínio sem se resumirem a três caixas coloridas.

Oferecer resumo rápido para referência e caminho aprofundado para estudo. Isso é divulgação progressiva, não duplicação editorial. Ao terminar, sugerir um próximo passo com motivo: aprofundar pré-requisito, testar uma hipótese ou continuar a missão.

### 9.5. Hub de laboratórios: escolher o experimento

Comparar laboratórios pelo fenômeno observado, decisões praticadas, pré-requisitos e tipo de interação. Diferenciar demonstração curta, experimento guiado e desafio.

Cada laboratório precisa de contexto próprio e ligação de retorno à aula ou missão de origem. Abrir um laboratório não deve montar uma vitrine interminável de outros experimentos ao redor dele.

### 9.6. Laboratório focado: bancada de investigação

Separar claramente cenário, controles, representação do sistema, evidências e interpretação. Uma única ação principal por etapa. Controles de pausa, passo, reinício e comparação devem ter significado consistente quando aplicáveis.

Alterar configuração não pode apagar tentativas silenciosamente. Preservar comparação, oferecer nova execução ou avisar claramente que o cenário será reiniciado. Uma tentativa deve ser reproduzível para que previsão e resultado possam ser discutidos.

Logs são evidências secundárias; não a única visualização do mecanismo. Explicar o evento relevante e sua causa. Resultados precisam de unidades, baseline e limites, não apenas números coloridos.

### 9.7. Feedback: um diagnóstico utilizável

Mostrar decisão tomada, resultado observado, critério atendido ou não, causa do equívoco e próxima ação. Evitar “errado, tente novamente” e elogios genéricos.

Separar erro de mecanismo, leitura incorreta da evidência e decisão desproporcional ao contexto. Se houver mais de uma solução válida, comentar os trade-offs em vez de impor uma receita única.

### 9.8. Progresso: mapa de aprendizagem e evidências

Substituir a auditoria universal de produção por uma visão honesta de contato com conteúdo, prática, domínio demonstrado e aplicação contextual. Destacar o que fazer a seguir, não só o quanto falta.

Cada competência permite inspecionar evidências, tentativas e lacunas, e abrir uma atividade adequada. Denominadores devem indicar claramente seu recorte: todos os conceitos, objetivo escolhido ou filtro atual.

Aplicação no próprio app fica em registro separado, com contexto, hipótese de relevância e evidência opcional. Permitir “não se aplica” com justificativa; não penalizar quem não precisa de Kubernetes ou multi-região.

### 9.9. Comparação e caderno de decisões

Comparações respondem a uma escolha real: filas versus fan-out, optimistic versus pessimistic locking, WebSocket versus SSE, JOIN versus lote. Usar critérios e cenários, não tabelas de vantagens genéricas.

O caderno reúne decisões e explicações produzidas pelo aluno, ligadas ao problema, tentativa e resultado. Deve permitir revisar o raciocínio e perceber mudança de entendimento; não ser um campo vazio de anotações sem conexão com a aprendizagem.

## 10. Interfaces desenhadas por tema

A Academy possui **15 categorias reais**, não uma taxonomia idealizada. Cada família pede uma linguagem de interação própria. Categorias grandes podem conter mais de um instrumento; a tabela é direção de design, não obrigação de construir um laboratório completo para cada termo.

| Categoria atual | Pergunta dominante | Representação central | Prática e evidência |
|---|---|---|---|
| **Traffic** | Para onde vai cada requisição e quando ela é aceita? | Fluxo de requisições, destinos, capacidade e linha do tempo. | Prever distribuição e rejeição; explicar limite de taxa versus balanceamento, proxy e gateway. |
| **Performance** | Onde se gasta tempo, memória ou capacidade? | Distribuição de latência, timeline de execução, ocupação de memória e ciclo de cache. | Identificar gargalo e comparar baseline; não misturar cache, thread safety e cold start no mesmo diagrama genérico. |
| **DevOps** | Como uma mudança atravessa versões e ambientes? | Pipeline, diferenças de configuração, tráfego por versão e estado de release. | Decidir release/rollback e verificar compatibilidade; estudar ferramentas sem exigir infraestrutura real. |
| **Resilience** | O que acontece quando uma dependência demora ou falha? | Máquina de estados, orçamento de tempo e sequência de tentativas. | Distinguir execução de confirmação; preservar invariantes durante retry e recuperação. |
| **Async** | Quem recebe, processa e confirma cada evento? | Trilhas de eventos, filas, assinantes, acknowledgements e compensações. | Diferenciar distribuir trabalho, fan-out e fluxo de negócio; rastrear duplicação, retry e DLQ. |
| **Streaming** | Quem inicia a comunicação e como a conexão vive? | Conversa cliente/servidor ao longo do tempo e ciclo de conexão. | Comparar polling, long polling, SSE e WebSocket por direção, frequência e reconexão. |
| **Database** | Que trabalho a consulta e os dados exigem? | Consulta, linhas retornadas, índice ilustrativo, pool e versões de schema. | Diagnosticar round-trips e cardinalidade; separar consulta, armazenamento, replicação e migração. |
| **Distributed** | Quem observa qual estado e em que ordem? | Réplicas, mensagens atrasadas, interleavings, locks e partições. | Construir um contraexemplo de consistência, corrida ou deadlock e defender uma escolha contextual. |
| **Scaling** | Como capacidade e demanda se encontram? | Demanda no tempo, instâncias, limites e distribuição geográfica de cache. | Explicar saturação, atraso de resposta do autoscaling e escala horizontal versus vertical. |
| **Reliability** | O sistema continua atendendo e consegue recuperar? | Estado das dependências, probes, failover e linha do tempo de restauração. | Diferenciar estar vivo, estar pronto e ter recuperação demonstrada; comparar RPO/RTO como contexto didático. |
| **Observability** | Que evidência permite entender o comportamento? | Visões conectadas de métrica, log e trace, com janela e unidades. | Testar hipótese usando sinais; distinguir sintoma, causa, SLI, SLO e orçamento de erro. |
| **Security** | Onde dados, identidade e interpretação mudam de significado? | Limites de confiança, fluxo de dados e comparação código/dados. | Revisar os temas existentes em casos fictícios controlados, sem criar área de login ou operação de segurança na Academy. |
| **Networking** | Como a informação percorre a comunicação? | Resolução DNS, sequência de mensagens, transporte e multiplexação. | Prever efeito de perda, latência e escolha de protocolo; não confundir uma animação de pacotes com medida real. |
| **Protocols** | Que contrato muda e quem continua compatível? | Diferenças de contrato, versões de cliente e matriz de compatibilidade. | Decidir mudança compatível ou breaking change e justificar versionamento. |
| **SRE** | Como agir diante da incerteza e aprender depois? | Dossiê de incidente, evidências, timeline de decisões e postmortem. | Formular hipótese, pedir evidência, decidir ação e registrar aprendizado sem caça a culpados. |

### 10.1. Limites para a personalização visual

Não criar quinze microsites com menus, tipografia e controles incompatíveis. Variar o instrumento de raciocínio, a composição da área central e o tipo de evidência, mantendo uma identidade editorial única.

Não diferenciar assuntos apenas com cor ou ícone. Um laboratório de concorrência precisa permitir observar ordem e conflito; trocar violeta por verde numa lista de logs não o torna específico.

## 11. Replanejamento dos seis laboratórios existentes

### 11.1. Rate Limiter — entender taxa, burst e experiência do cliente

**Hoje:** capacidade fixa de cinco tokens, reposição a cada 1,5 segundo, envio manual e log; a representação de tokens atualiza quando uma requisição é feita.

**Objetivo:** prever aceitação de requisições ao longo do tempo e distinguir capacidade de burst, taxa sustentada e resposta ao cliente.

**Bancada:** reservatório de tokens ligado a uma timeline de requisições; parâmetros de capacidade e reposição; clientes identificáveis; aceitas e rejeitadas representadas sem depender só de cor.

**Experimento:** prever uma sequência, executá-la por passos e comparar duas configurações sob a mesma carga. Reposição e passagem do tempo devem ficar explícitas, mesmo se o modelo usar cálculo sob demanda.

**Evidência:** explicar por que uma rajada cabe no bucket, por que a taxa sustentada é diferente e qual o efeito do escopo do limite. Retry-After e comportamento de um cliente cooperativo podem compor uma variante, sem afirmar que o laboratório cobre todo backoff.

**Desafio:** atender uma rajada legítima sem permitir fluxo sustentado incompatível com o cenário. Não avaliar apenas quantidade de respostas 200.

### 11.2. Circuit Breaker — observar proteção e recuperação

**Hoje:** sucesso ou falha manual, abertura após três falhas, cooldown fixo, badge de estado e log.

**Objetivo:** explicar estados e transições, comparar chamadas com/sem proteção e distinguir circuit breaker de timeout e retry.

**Bancada:** máquina de estados visível, timeline da dependência, requisições em andamento e caminho de fast fail; critérios de abertura e recuperação explicitados.

**Experimento:** aplicar a mesma sequência de resultados em dois cenários e prever quando uma chamada alcança a dependência. Explorar falha persistente, intermitência e recuperação.

**Evidência:** explicar o benefício e o custo de rejeitar temporariamente, o significado da tentativa half-open e a diferença entre limite por falhas consecutivas e outras políticas possíveis.

**Desafio:** escolher uma configuração para um cenário com objetivo declarado, sem vender um threshold universal. Uma falha bem tratada pode ser melhor que uma longa espera.

### 11.3. N+1 Visualizer — diagnosticar acesso a dados sem receitas absolutas

**Hoje:** 25 usuários, alternância entre 26 consultas e um JOIN, latência sintética e SQL ilustrativo.

**Objetivo:** reconhecer round-trips redundantes e comparar estratégias considerando quantidade de linhas, relacionamento e paginação.

**Bancada:** código de acesso, consultas emitidas, timeline de idas e voltas, dados retornados e custo estimado separados. Identificar os números como modelo didático, não benchmark.

**Experimento:** variar tamanho da lista, cardinalidade do relacionamento e custo de ida/volta; comparar acesso por item, lote e JOIN sob os mesmos dados.

**Evidência:** justificar a estratégia e apontar quando menos consultas aumenta volume ou altera paginação. Não declarar index scan sem representar o índice e seu efeito.

**Desafio:** obter o conjunto correto de dados com um orçamento definido, preservando significado de paginação e evitando otimização baseada só no contador de queries.

### 11.4. SQL Injection — distinguir código de dados com resultado coerente

**Hoje:** entrada livre e dois modos; veredito fixo, sem execução semântica correspondente ao texto digitado.

**Objetivo:** demonstrar como concatenação pode alterar uma expressão e como parametrização preserva entrada como dado.

**Bancada:** coleção fictícia de dados, expressão e parâmetros apresentados separadamente, tokens relevantes destacados e resultados consistentes com os casos suportados.

**Experimento:** testar entradas comuns, aspas e casos didáticos controlados. Um caso fora do modelo deve ser identificado como não suportado, não receber um veredito inventado.

**Evidência:** explicar a diferença entre interpretar uma entrada e compará-la literalmente. O modo parametrizado pode retornar linhas quando o dado corresponde; não deve prometer vazio por definição.

**Desafio:** corrigir um acesso ilustrativo e justificar a mudança. XSS, WAF e outros temas só podem aparecer como contexto claramente separado, nunca como competências demonstradas pelo exercício SQL.

Não construir autenticação real para este laboratório. Seu objeto é interpretação de consultas em ambiente fictício, não uma área de login do produto.

### 11.5. Pub/Sub + Queue — separar distribuição de trabalho e distribuição de eventos

**Hoje:** uma fila, três workers, processamento por passos, retry no mesmo worker, falha probabilística e contador de DLQ; trocar a configuração recria a fila e zera os contadores.

**Objetivo:** distinguir competing consumers de fan-out e rastrear a trajetória de um evento até confirmação, nova tentativa ou recuperação.

**Bancada:** visão de fila compartilhada e visão de assinantes independentes como modos conceitualmente distintos; eventos identificáveis, workers/assinantes, tentativas e estado de confirmação.

**Experimento:** publicar uma sequência reproduzível e prever quantas entregas existirão em cada modo. Aplicar falha transitória, mensagem inválida e consumidor lento como causas diferentes.

**Evidência:** explicar por que retry existe, quando uma mensagem deve ir para DLQ, por que falha de worker não prova poison message e quais garantias o modelo não oferece.

**Desafio:** investigar acúmulo, recuperar um evento da DLQ após corrigir sua causa e lidar com duplicação num exemplo de negócio. Observabilidade deve explicar o ocorrido, não limitar-se a contadores verdes.

Configuração e reinício devem ser ações separadas. Comparar tentativas exige preservar a evidência anterior ou avisar explicitamente que um novo cenário começa.

### 11.6. P99 & Tail Latency — ler uma distribuição com rigor

**Hoje:** amostra de 100 requisições, P50/P99/P99.9/máximo e histograma sem eixos visíveis; legenda descreve uma cauda singular que a geração não garante.

**Objetivo:** calcular e interpretar percentis, distingui-los de média/máximo e entender tamanho de amostra e janela de observação.

**Bancada:** histograma com eixos, unidades, intervalos e contagens; lista ordenada ou curva acumulada complementar; marcadores de percentis e limite relevante ao cenário.

**Experimento:** usar uma distribuição manual simples antes da probabilística, variar amostra e proporção da cauda, comparar cenários com mesma média e experiências diferentes.

**Exemplo obrigatório de rigor:** com 99 respostas de 100 ms e uma de 10.000 ms, nearest-rank produz P99 de 100 ms, máximo de 10.000 ms e média de 199 ms. A resposta extrema não deve ser chamada automaticamente de P99.

**Evidência:** localizar qual observação determina o percentil e explicar por que P99.9 em 100 amostras é frágil para inferir comportamento populacional. Explicitar a convenção de cálculo.

**Desafio:** defender qual medida responde à pergunta do cenário e que dados faltam. Não premiar “baixar o P99” quando isso mascara erro de interpretação ou comparação de amostras incompatíveis.

## 12. Missões integradas: conhecimento que se conecta

Usar um pequeno produto fictício recorrente — por exemplo, uma loja digital com catálogo e processamento de pedidos — para diminuir a carga de reaprender o contexto. Variantes em outros domínios são necessárias depois para verificar transferência.

Cada missão reúne briefing, baseline, restrições, evidências iniciais, decisões, perturbação e defesa final. Não deve informar antecipadamente qual padrão é a resposta.

### 12.1. A compra foi cobrada, mas a resposta se perdeu

Conecta timeout, retry, backoff e idempotência. O aluno precisa distinguir desconhecimento do resultado e falha confirmada, comparar chaves repetidas e novas e preservar uma operação de negócio.

**Produto de aprendizagem:** timeline comentada, política de repetição e justificativa do invariante “uma compra não gera cobrança adicional por repetição da mesma operação”.

**Transferência:** aplicar o raciocínio à criação de um documento ou pedido, sem usar a palavra pagamento no enunciado.

### 12.2. O catálogo ficou lento e às vezes mostra informação antiga

Conecta round-trips, N+1, consulta em lote, cardinalidade, cache, invalidação e percentis. A primeira hipótese pode estar incompleta; o aluno recebe evidência que obriga a separar lentidão de desatualização.

**Produto de aprendizagem:** comparação antes/depois, decisão de acesso a dados e estratégia de atualização proporcionais ao caso.

**Transferência:** um feed ou diretório com padrão de atualização diferente. O conhecimento deve sobreviver à mudança de domínio.

### 12.3. Os pedidos não param de acumular

Conecta fila, capacidade, backpressure, retry, DLQ e sinais observáveis. Diferencia aumento de carga, consumidor lento e mensagem inválida.

**Produto de aprendizagem:** explicação da causa sustentada por evidências, plano de recuperação e distinção entre notificar assinantes e distribuir trabalho.

**Transferência:** processamento de arquivos ou notificações, incluindo uma duplicação que exige raciocínio de idempotência.

### 12.4. Uma mudança funcionou sozinha, mas quebrou clientes antigos

Conecta contratos, versão de API, schema, migração e estratégia de release. Não exige pipeline real: a aprendizagem está na compatibilidade e na sequência das decisões.

**Produto de aprendizagem:** matriz de compatibilidade, ordem argumentada de mudança e condição de rollback.

### 12.5. A métrica mudou; ainda não sabemos por quê

Conecta observabilidade, investigação de incidente e postmortem. Exige formular hipóteses concorrentes, selecionar evidências e reconhecer incerteza.

**Produto de aprendizagem:** dossiê curto com fato, hipótese, ação, verificação e aprendizado. Evitar transformar investigação em adivinhação do botão correto.

As missões devem ter profundidade antes de ter quantidade. São propostas de alcance; não uma obrigação de entregar simultaneamente um grande catálogo de cenários.

## 13. Personalização útil, explicável e controlável

Personalização significa adaptar o próximo passo à intenção e às evidências, não decorar a interface com o nome do aluno.

- Objetivo escolhido influencia contexto e relevância das recomendações.
- Conhecimento prévio demonstrado permite reduzir apoio, sem declarar competência por autopercepção.
- Erros recorrentes indicam contraste ou pré-requisito a trabalhar.
- Acerto com baixa confiança pede consolidação; erro com alta confiança pede um contraexemplo que discrimine o equívoco.
- Tempo disponível pode sugerir uma unidade menor; não deve limitar o nível de conhecimento presumido.
- Preferência por consulta ou estudo guiado muda a navegação, não a correção do conteúdo.
- Recomendações exibem motivo curto e podem ser ignoradas. Exemplo: “Retome esta prática porque sua última decisão confundiu timeout com confirmação de falha”.
- Não inferir “estilos de aprendizagem”, competência por velocidade de clique ou desinteresse por uma ausência de acesso.

**Continuidade esperada:** retomar missão, tentativa e configuração relevante; saber o que foi preservado; poder reiniciar conscientemente. Preferências de leitura, anotações e evidências precisam de comportamento transparente caso sejam mantidas apenas no dispositivo.

A futura escolha de armazenamento não é definida por este documento. O requisito de produto é continuidade sem tornar login obrigatório; não prometer sincronização entre dispositivos que ainda não existe.

## 14. Avaliação, progresso e retenção

### 14.1. Separar o que está sendo medido

| Dimensão | O que significa | O que não significa |
|---|---|---|
| Contato | Conteúdo consultado. | Entendimento ou aplicação. |
| Prática | Atividade realizada, com grau de ajuda conhecido. | Domínio independente. |
| Demonstrado no contexto | Critérios atendidos em uma tarefa sem apoio decisivo. | Transferência para qualquer situação. |
| Transferido | Princípio aplicado em uma variante relevante. | Retenção comprovada ao longo do tempo. |
| Retido | Recuperação posterior bem-sucedida. | Competência permanente ou prontidão de um app. |
| Aplicação declarada | Uso relatado no contexto do próprio projeto. | Auditoria técnica ou certificação operacional. |

Uma revisão pendente não apaga automaticamente a aprendizagem anterior; indica que falta evidência recente de retenção. O aluno precisa saber que tipo de informação sustenta cada estado.

### 14.2. Rubrica de raciocínio

Avaliar mecanismo correto, adequação ao contexto, uso das evidências e reconhecimento de limites. Uma justificativa eloquente não compensa um erro crítico, como permitir duplicação da operação que deveria ser preservada.

Preferir interpretação por critérios a uma nota agregada opaca. Questões fechadas podem avaliar previsões objetivas; justificativas abertas precisam de exemplos e critérios transparentes, sem fingir avaliação automática sofisticada quando ela não existir.

Domínio demonstrado deve exigir tarefa independente e uma variante pertinente; retenção exige recuperação posterior. Esse é um princípio de planejamento, não um limiar psicométrico validado.

### 14.3. Registro de evidência

Uma evidência útil associa tarefa, cenário, decisão, justificativa, resultado, critérios, apoio utilizado e momento da tentativa. O aluno deve poder revisitar a evidência e perceber o que mudou em seu entendimento.

Não armazenar apenas “acertou” ou “concluiu”. Não converter um marcador antigo do checklist em domínio demonstrado: registros anteriores representam autodeclaração e precisam manter esse significado.

### 14.4. Revisão

Retomar decisões e equívocos, não repetir a mesma pergunta com opções rearranjadas. Alternar recuperação curta, contraste e variante; evitar uma fila punitiva de centenas de tarefas atrasadas.

Os intervalos devem ser hipóteses a calibrar, não números escolhidos para parecer científicos. Uma sessão interrompida e uma tentativa malsucedida precisam de rotas de retomada respeitosas.

## 15. Direção de UX/UI e profissionalismo visual

### 15.1. Identidade: academia editorial com instrumentos de engenharia

Evoluir a identidade atual em vez de cobri-la com efeitos. A Academy precisa ser reconhecida como um lugar de estudo aplicado: títulos claros, conteúdo legível, diagramas precisos, controles confiáveis e evidências bem apresentadas.

Preservar a ligação com o tema técnico, mas reduzir a sensação de painel escuro genérico e a dominância de um único acento violeta. Cores devem representar estado e informação, não ornamentar cada seção.

A escolha exata de paleta, fontes e temas pertence ao desenho posterior. O requisito é contraste suficiente, hierarquia editorial consistente e instrumentos que continuem legíveis em estados densos, não uma troca arbitrária de marca.

### 15.2. Tipografia e densidade

Usar texto corrido confortável para estudo; monoespaçada para código, identificadores e dados que realmente se beneficiam dela. Evitar labels excessivamente pequenos, caixa alta em explicações e espaçamento entre letras como solução genérica de sofisticação.

Espaço em branco deve separar ideias e dar foco, não esconder a falta de conteúdo. A página de conceito não precisa parecer preenchida; precisa ter uma experiência central substancial e uma sequência de leitura clara.

### 15.3. Composição

Seções editoriais abertas, com linhas, colunas e divisórias quando úteis. Reservar cards a itens repetidos, resultados individuais e ferramentas genuinamente enquadradas; evitar caixas dentro de caixas.

Uma bancada pode usar áreas distintas para instrumento, parâmetros e evidências, sem transformar cada pedaço numa miniatura decorativa. Gráficos e diagramas devem ocupar espaço suficiente para serem lidos e manipulados.

### 15.4. Controles e estados

Usar controles familiares: sliders ou entradas para parâmetros; seleção segmentada para modos; switches para condições binárias; ícones com nome acessível para pausa, passo e reset.

Toda ação precisa de consequência previsível: distinguir executar, comparar, aplicar configuração e reiniciar. Não usar “ON” num botão que secretamente destrói a tentativa anterior.

Planejar estados inicial, em execução, pausado, concluído, inconclusivo, resposta fora do modelo, ausência de evidência e retomada. A qualidade percebida mora nessas transições, não apenas na tela ideal.

### 15.5. Movimento e assets

Animação deve representar chegada de mensagem, espera, transição ou mudança de estado. Nunca tornar a experiência dependente de acompanhar algo rápido. Pausa e execução por passos são mais úteis que espetáculo.

Priorizar diagramas e dados que expliquem o objeto de estudo. Imagens decorativas de servidores, personagens genéricos ou cenários futuristas não substituem a visualização de um mecanismo.

## 16. Celular, acessibilidade e ergonomia de estudo

- Desenhar a experiência móvel a partir da tarefa, não apenas empilhar a versão desktop.
- Mostrar cenário e pergunta antes da bancada; manter resultado acessível depois da ação, sem longos deslocamentos para descobrir o efeito.
- Instrumentos largos precisam de visão resumida e inspeção por entidade/etapa. Rolagem horizontal fica restrita a conteúdos que exigem largura, como código ou timeline, não à página inteira.
- Oferecer tabela ou descrição equivalente para gráficos e diagramas. Não exigir hover para encontrar valores, legenda ou explicação.
- Todas as interações essenciais devem funcionar com teclado e nomes acessíveis; seleção por arrastar deve ter alternativa por comandos.
- Diferenciar estados com texto, forma e posição além da cor. Animação reduzida deve preservar o raciocínio do experimento.
- Manter foco previsível ao avançar etapas e mostrar feedback. Não anunciar cada linha de um fluxo de logs continuamente a quem usa leitor de tela.
- Permitir zoom e textos maiores sem perda de controles. Títulos, números e unidades não devem disputar espaço nem truncar o significado.
- Controles de apoio devem estar próximos do momento da dúvida; instruções não devem virar uma parede de texto antes da primeira prática.
- Sessões curtas precisam fechar uma unidade de raciocínio ou permitir interrupção clara. O aluno deve reconhecer o ponto em que está voltando.

## 17. Exemplos de jornadas completas

### 17.1. Iniciante: “o usuário clicou duas vezes”

1. Entra pelo problema de duplicação, não pelo nome Idempotency.
2. Observa duas solicitações e prevê se representam uma ou duas operações de negócio.
3. Recebe o modelo mental de identificação da operação e seus limites.
4. Compara repetição com mesma identificação e criação de uma operação nova.
5. Encontra uma resposta perdida e percebe por que timeout não resolve a ambiguidade.
6. Decide uma política e explica o invariante preservado.
7. Resolve uma variante sobre geração de documentos sem repetir o enunciado original.
8. Sai com evidência do contexto e uma revisão futura, não com selo de app pronto.

### 17.2. Experiente: “quero testar o que sei sobre P99”

1. Entra diretamente por desafio.
2. Analisa distribuição pequena, define o P99 e indica confiança.
3. Se erra, recebe o ponto exato da confusão entre percentil e máximo.
4. Consulta o método de cálculo necessário, sem reler toda uma aula introdutória.
5. Compara outra distribuição e decide que medida responde a uma pergunta de experiência do usuário.
6. Registra o resultado e segue para uma variante de amostragem, não para o conceito de ID seguinte.

### 17.3. Consulta por sintoma: “minha fila cresce”

1. Busca a frase e encontra hipóteses, conceitos e o laboratório pertinente.
2. Abre a visão de competing consumers com contexto de origem preservado.
3. Compara taxa de chegada e processamento e seleciona a evidência que falta.
4. Distingue um consumidor lento de mensagens inválidas.
5. Testa uma intervenção no modelo e explica o que ela resolve e não resolve.
6. Leva uma ficha de investigação para o próprio contexto, sem o produto afirmar diagnóstico do aplicativo real.

### 17.4. Retorno depois de uma interrupção

O aluno vê qual decisão estava investigando, retoma cenário e evidência, recupera a hipótese anterior e continua. Se o estado não puder ser restaurado, a interface informa o que permaneceu e oferece recomeço curto. “Continuar” não pode ser uma promessa vazia.

## 18. Como saber se a evolução ficou realmente melhor

Qualidade funcional é necessária, mas testes de interface não demonstram aprendizagem. Validar também precisão conceitual, clareza de tarefa, interpretação de evidências e transferência.

### 18.1. Perguntas de validação com alunos

- Entendem o objetivo da atividade sem uma explicação do avaliador?
- Conseguem prever antes de ver e explicar por que o resultado ocorreu?
- Distinguem um modelo sintético de uma medição real?
- Escolhem uma alternativa válida quando a solução mais conhecida é inadequada?
- Resolvem uma variante em que nomes, números e apresentação mudam?
- O feedback corrige o equívoco ou apenas informa a alternativa esperada?
- Conseguem retomar uma atividade, encontrar uma lacuna e dar o próximo passo?
- Recuperam o mecanismo depois de um intervalo sem depender do mesmo roteiro?
- Pessoas iniciantes e experientes conseguem percursos adequados sem fricção desnecessária?
- A versão móvel e as alternativas acessíveis permitem o mesmo raciocínio essencial?

### 18.2. Evidências de utilidade

Observar qualidade de justificativas, independência, transferência, retenção, recorrência de equívocos e capacidade de interpretar resultados. Comparar tarefas equivalentes antes/depois quando fizer sentido; não confundir mudança de dificuldade com melhoria.

Número de cliques, tempo de sessão e taxa de conclusão ajudam a detectar fricção, mas não devem ser a prova principal de sucesso. Uma sessão curta que resolve uma dúvida pode ser excelente; uma longa sessão de repetição sem compreensão não é vitória.

Não fixar metas percentuais arbitrárias neste planejamento. Primeiro definir o que é evidência válida e observar a base real de desempenho.

### 18.3. Qualidade do material

Revisar cada explicação e laboratório com exemplos que possam contrariar sua conclusão. Conferir cobertura direta versus relação contextual, fórmulas, unidades, amostras e invariantes. Uma interface polida com um veredito impossível continua sendo material ruim.

## 19. Núcleo indispensável e extensões condicionais

Esta é uma hierarquia de valor, não um cronograma nem uma divisão em fases.

**Núcleo indispensável:** metodologia completa; revisão das imprecisões; conteúdo com objetivos e limites; laboratório focado com evidência coerente; jornadas que conectam dúvida, prática e retorno; progresso sem falsa prontidão; instrumentos específicos por tema; legibilidade e acessibilidade.

**Ampliação de profundidade:** missões integradas, contrastes entre mecanismos, variantes independentes, revisão e caderno de decisões. Essas capacidades tornam a base transferível, não apenas mais extensa.

**Extensões condicionais:** mais laboratórios, novos contextos, idiomas adicionais, materiais exportáveis e formas adicionais de comparação. Só devem crescer quando o núcleo já sustenta qualidade e a extensão atende uma necessidade identificada.

**Não confundir evolução com volume:** não é necessário construir 111 sandboxes para oferecer cobertura séria. Todo conceito precisa de objetivo, representação adequada e uma forma de prática ou aplicação verificável; nem todos precisam de um simulador independente.

## 20. Riscos de descaracterização

| Atalho tentador | Por que falha | Direção correta |
|---|---|---|
| Trocar paleta e adicionar animações. | Embala a mesma superficialidade. | Desenhar o instrumento e a tarefa antes da ornamentação. |
| Alongar todos os textos. | Aumenta leitura sem necessariamente aumentar entendimento. | Acrescentar mecanismo, contraste e prática pertinentes. |
| Criar um quiz por conceito. | Pode medir reconhecimento e memória do enunciado. | Avaliar previsão, diagnóstico, decisão e transferência. |
| Colocar tudo num chatbot. | Esconde estrutura e torna qualidade difícil de inspecionar. | Conteúdo, feedback e percurso explícitos e confiáveis. |
| Fazer um dashboard cheio de números. | Pode dar aparência de precisão sem evidência. | Mostrar dimensões compreensíveis e o que as sustenta. |
| Criar uma tela completamente diferente para cada termo. | Fragmenta a experiência e encarece coerência editorial. | Famílias de instrumentos dentro de uma identidade única. |
| Prescrever a arquitetura mais complexa. | Ensina dependência de receitas e sobreengenharia. | Defender adequação e soluções proporcionais. |
| Converter histórico antigo em “domínio”. | Reinterpreta uma autodeclaração como prova. | Preservar seu significado e recolher evidência nova. |
| Vincular assuntos próximos como se fossem praticados. | Produz cobertura fictícia. | Nomear o tipo de relação e o alcance de cada laboratório. |

## 21. Questões que o PRD futuro deverá resolver — sem resolvê-las agora

O planejamento define a experiência e seu nível de exigência. O documento posterior deverá escolher soluções para representação de conteúdo, preservação de tentativas, compatibilidade de links existentes, continuidade de estado, instrumentação dos laboratórios e organização dos componentes.

Também deverá transformar as rubricas em critérios verificáveis por atividade, delimitar quais variantes são realmente avaliáveis, definir como respostas abertas recebem apoio sem falsa automação e estabelecer o tratamento transparente de modelos limitados.

As decisões editoriais futuras incluem profundidade por conceito, revisão especializada, fontes, linguagem do produto e vocabulário de progresso. Não devem contradizer a fronteira principal: aprender de forma útil e completa sem tornar login ou infraestrutura complexa o centro da evolução.

Nada nesta seção inicia a criação de PRD ou roadmap. Ela apenas protege a separação entre intenção do produto e solução de implementação.

## 22. Síntese: o padrão de excelência do Project 2

A Academy evolui de verdade quando deixa de pedir que o aluno apenas reconheça nomes e marque itens, e passa a ajudá-lo a **observar um problema, construir um modelo, testar uma hipótese, justificar uma escolha e reconhecer seus limites**.

Uma experiência bem feita será reconhecida pela adequação de cada tela ao assunto, pela coerência dos experimentos, pela profundidade sem jargão desnecessário, pela honestidade do progresso e pela facilidade de continuar aprendendo.

O teste decisivo não é “parece um produto maior?”. É: **“a pessoa consegue tomar uma decisão melhor numa situação nova e explicar, com evidências, por que essa decisão faz sentido?”**

Esse é o pilar central para as próximas decisões de produto, conteúdo e design. Nenhuma expansão deve substituir esse compromisso por volume de páginas, complexidade técnica ou acabamento superficial.