export type ManualSection = { title: string; paragraphs: string[]; steps?: string[]; items?: string[]; note?: string }
export type ManualChapterData = { id: string; title: string; description: string; sections: ManualSection[] }

export const chapters: ManualChapterData[] = [
    {
        "id": "apresentacao",
        "title": "Apresentação do sistema",
        "description": "Finalidade da plataforma e contexto do projeto.",
        "sections": [
            {
                "title": "O projeto Skate no Cedin",
                "paragraphs": [
                    "Desenvolvido continuamente desde 2023 no CEDIN Ângela Dalçóquio de Souza, em Itajaí (SC), o projeto utiliza o skate e a cultura urbana como linguagem pedagógica na Educação Integral. Busca ampliar o repertório cultural, promover desenvolvimento motor, convivência, autonomia e vínculos com a escola.",
                    "A plataforma organiza a gestão das atividades e apoia o acompanhamento da participação. Os registros digitais não substituem a observação pedagógica nem abrangem necessariamente toda a trajetória desde 2023."
                ]
            },
            {
                "title": "Quem utiliza a plataforma",
                "paragraphs": [
                    "O sistema é destinado à equipe autorizada do projeto e à coordenação. A página institucional é pública; os módulos de gestão exigem autenticação."
                ],
                "items": [
                    "Alunos: cadastro, perfil, fotografias e histórico.",
                    "Frequência: presenças e faltas por data.",
                    "Controle de aulas: sessões, situações e professores vinculados.",
                    "Professores: cadastro e histórico de atuação.",
                    "Dashboard e Relatórios: indicadores, análises e exportações."
                ]
            },
            {
                "title": "Qualidade dos registros",
                "paragraphs": [
                    "Registre informações de acordo com as atividades efetivamente realizadas. A qualidade dos indicadores depende da consistência dos registros."
                ]
            }
        ]
    },
    {
        "id": "conhecendo",
        "title": "Acesso e navegação",
        "description": "Como entrar, localizar as páginas e utilizar a interface responsiva.",
        "sections": [
            {
                "title": "Entrar no sistema",
                "paragraphs": [],
                "steps": [
                    "Abra skatenocedin.com e selecione Entrar ou Acessar plataforma.",
                    "Informe o e-mail e a senha da conta autorizada. Utilize o botão de visualizar a senha se necessário.",
                    "Selecione Entrar na plataforma. Após a autenticação, o sistema direciona para o Dashboard."
                ],
                "note": "Não existe cadastro público de novas contas. Se não tiver acesso, solicite orientação à administração."
            },
            {
                "title": "Menu principal",
                "paragraphs": [],
                "items": [
                    "Dashboard: visão geral do mês atual e aniversariantes.",
                    "Alunos: cadastro e consulta dos participantes.",
                    "Frequência: registro diário de participação.",
                    "Controle de aulas: organização de sessões e calendário.",
                    "Professores: cadastro e vínculos profissionais.",
                    "Relatórios: análises por período, turma e turno.",
                    "Manual: orientações de uso."
                ]
            },
            {
                "title": "Celular e computador",
                "paragraphs": [
                    "No celular, abra o menu lateral pelo botão do cabeçalho. As páginas apresentam listas e filtros compactos. No computador, a navegação utiliza o espaço disponível e pode apresentar tabelas.",
                    "Utilize o controle de tema para alternar entre claro e escuro. Nos formulários, role o conteúdo e utilize os botões de ação ao final. Confira mensagens de erro e aguarde a conclusão do salvamento antes de repetir uma operação."
                ]
            },
            {
                "title": "Página pública e encerramento da sessão",
                "paragraphs": [
                    "A landing page apresenta a história, os pilares pedagógicos, a metodologia, a infraestrutura, os horários, a galeria e os indicadores agregados. Não é necessário fazer login para consultá-la.",
                    "Ao concluir o trabalho, encerre a sessão pela opção de saída do sistema, especialmente em equipamentos compartilhados."
                ]
            }
        ]
    },
    {
        "id": "alunos",
        "title": "Gestão de alunos",
        "description": "Cadastro, consulta, atualização, fotografias e situação dos participantes.",
        "sections": [
            {
                "title": "Cadastrar um aluno",
                "paragraphs": [],
                "steps": [
                    "Abra Alunos e selecione Novo aluno.",
                    "Informe nome completo, data de nascimento e turma escolar, campos obrigatórios.",
                    "Preencha matrícula escolar, gênero e informações do responsável quando disponíveis.",
                    "Confira o turno automático e o nível cadastral. Se desejar, selecione uma fotografia autorizada.",
                    "Selecione Salvar aluno e confira a confirmação."
                ],
                "items": [
                    "Matrícula escolar: exatamente 11 dígitos quando informada; não utilize CPF ou INEP.",
                    "Gênero: Masculino, Feminino ou Não informado. Não deduza pelo nome.",
                    "Nascimento: informe a data correta; a idade é calculada automaticamente.",
                    "Turma escolar: selecione a turma oficial disponível. O turno decorre da turma (Manhã, Tarde ou Integral).",
                    "Data de início: registrada automaticamente no cadastro.",
                    "Nível: campo cadastral existente, com Iniciante como padrão; avaliação pedagógica detalhada ainda não disponível.",
                    "Responsável: nome e contato, quando informados; observações apenas pertinentes ao projeto."
                ]
            },
            {
                "title": "Fotografia no cadastro",
                "paragraphs": [
                    "A fotografia é opcional. Selecione JPEG, PNG ou WebP de até 5 MB. Confira a prévia; é possível trocar ou remover a imagem selecionada antes de salvar.",
                    "Se o aluno for cadastrado, mas a foto falhar, não faça outro cadastro: adicione a imagem pelo perfil individual."
                ]
            },
            {
                "title": "Buscar e filtrar alunos",
                "paragraphs": [
                    "Use a busca por nome ou matrícula e os filtros de situação, turno e turma. Os filtros podem ser combinados. A listagem padrão apresenta os ativos."
                ],
                "items": [
                    "Ativos: participantes com cadastro ativo.",
                    "Inativos: cadastros desativados.",
                    "Todos: ativos e inativos.",
                    "Tarde: inclui também Integral; Integral, quando selecionado separadamente, mostra apenas esse grupo."
                ]
            },
            {
                "title": "Perfil individual e edição",
                "paragraphs": [
                    "Abra o aluno para consultar dados pessoais, turma, responsável, fotografias e histórico de frequência. Os indicadores individuais mostram presenças, faltas, total de registros e percentual de frequência."
                ],
                "steps": [
                    "Selecione Editar aluno no perfil.",
                    "Atualize os campos necessários e confira a turma escolar e o turno automático.",
                    "Salve as alterações. Caso a turma antiga não esteja mais disponível, preserve o vínculo quando o formulário permitir, ou solicite orientação à coordenação."
                ]
            },
            {
                "title": "Galeria de fotografias",
                "paragraphs": [
                    "A galeria permite adicionar imagens, escolher a foto principal e consultar as demais. A foto principal é utilizada na identificação do aluno nas listas. As imagens ficam em armazenamento privado.",
                    "Para excluir uma foto, observe as restrições da galeria: a foto principal e a última fotografia não devem ser removidas. Se necessário, escolha outra foto principal primeiro. Use apenas imagens autorizadas."
                ]
            },
            {
                "title": "Desativar ou reativar",
                "paragraphs": [
                    "Quando um aluno deixar de participar, utilize Desativar no perfil, se autorizado. O cadastro, as fotografias e o histórico permanecem registrados. Para reativar, filtre os inativos, abra o perfil e utilize Reativar.",
                    "Não utilize a desativação para corrigir uma falta isolada. Não crie outro cadastro para um aluno que retornou."
                ]
            },
            {
                "title": "Exportar a listagem",
                "paragraphs": [
                    "A exportação CSV da página de alunos acompanha os filtros da listagem. Pode conter dados pessoais: compartilhe somente com destinatários autorizados e para finalidade institucional."
                ]
            }
        ]
    },
    {
        "id": "frequencia",
        "title": "Controle de frequência",
        "description": "Registro diário de presença, faltas e acompanhamento individual.",
        "sections": [
            {
                "title": "Preparar a chamada",
                "paragraphs": [],
                "steps": [
                    "Abra Frequência.",
                    "Confira a data e selecione o turno.",
                    "Use os filtros de turma e busca para localizar os participantes e confira a lista antes de registrar."
                ],
                "items": [
                    "Manhã: alunos da manhã.",
                    "Tarde: alunos da tarde e do Integral.",
                    "Todos: alunos de todos os turnos, quando disponível."
                ],
                "note": "Alunos do Integral participam das aulas à tarde. Cada aluno possui um único registro de frequência por data."
            },
            {
                "title": "Registrar presenças e faltas",
                "paragraphs": [],
                "steps": [
                    "Marque os alunos efetivamente presentes. Se usar Marcar todos, desmarque os ausentes.",
                    "Revise a relação filtrada e as marcações.",
                    "Selecione a opção de salvar frequência e confira a confirmação de faltas."
                ],
                "note": "Ao salvar, os alunos visíveis não marcados recebem falta. Os alunos fora do filtro não são alterados. Não salve uma lista que inclua alunos que não deveriam participar naquele dia."
            },
            {
                "title": "Corrigir um registro",
                "paragraphs": [
                    "Selecione a data correspondente e refaça as marcações dos alunos que precisam de correção. O sistema atualiza o registro do aluno naquela data, sem criar uma segunda chamada.",
                    "A frequência é registrada por aluno e data, não por sessão de aula. Alunos inativos podem não aparecer na lista de chamada, mesmo para datas anteriores; o histórico já registrado permanece no perfil."
                ]
            },
            {
                "title": "Interpretar o histórico",
                "paragraphs": [
                    "No perfil do aluno, consulte o histórico mensal, o último comparecimento e os indicadores de presença e falta. A frequência é calculada por presenças ÷ (presenças + faltas) × 100.",
                    "Sem registros, não há base para calcular percentual de participação. Ausência de registro não deve ser interpretada como falta."
                ]
            },
            {
                "title": "Boas práticas",
                "paragraphs": [
                    "Faça a chamada somente para a atividade efetivamente ofertada. Confira datas, filtros e alunos não marcados. Se o carregamento ou o salvamento falhar, não presuma que o registro foi concluído."
                ]
            }
        ]
    },
    {
        "id": "aulas",
        "title": "Controle de aulas",
        "description": "Sessões, horários, situações, calendário e vínculos com professores.",
        "sections": [
            {
                "title": "Horários de referência",
                "paragraphs": [
                    "Cada turno possui até duas aulas. As aulas da manhã e da tarde duram 105 minutos (1h45), sem contabilizar os intervalos Ciranda."
                ],
                "items": [
                    "Manhã: 07:30–09:15 e 09:45–11:30; intervalo 09:15–09:45.",
                    "Tarde: 13:00–14:45 e 15:15–17:00; intervalo 14:45–15:15.",
                    "Noite: disponível no sistema, sem horário ou duração definidos."
                ]
            },
            {
                "title": "Registrar uma aula",
                "paragraphs": [],
                "steps": [
                    "Abra Controle de aulas e confira a data.",
                    "Selecione Manhã, Tarde ou Noite, conforme a atividade.",
                    "Adicione a sessão correspondente, respeitando o limite de duas por turno.",
                    "Confira a situação da aula e os professores vinculados."
                ]
            },
            {
                "title": "Realizada ou cancelada",
                "paragraphs": [
                    "Registre como Realizada quando a atividade aconteceu e como Cancelada quando não ocorreu. É possível corrigir o status posteriormente. Uma aula cancelada não compõe a carga horária realizada.",
                    "Use a exclusão apenas para registros indevidos, se autorizado; prefira alterar o status quando a atividade estava prevista, mas não aconteceu."
                ]
            },
            {
                "title": "Vincular professores",
                "paragraphs": [
                    "Na sessão, abra a opção de professores e selecione os profissionais que atuaram naquela aula. Uma mesma sessão pode ter mais de um professor. Confira os vínculos após salvar.",
                    "Os vínculos alimentam o histórico profissional, os relatórios de horas-professor e a cobertura das aulas. Corrija vínculos indevidos para evitar contagens incorretas."
                ]
            },
            {
                "title": "Calendário e histórico",
                "paragraphs": [
                    "Abra o calendário mensal para navegar entre meses e selecionar uma data. Consulte os registros realizados e cancelados. Uma data com várias aulas realizadas conta como apenas um dia de atividade.",
                    "Os indicadores consolidados estão no Dashboard e em Relatórios. O calendário é a ferramenta operacional para consultar registros por data."
                ]
            }
        ]
    },
    {
        "id": "professores",
        "title": "Gestão de professores",
        "description": "Cadastro da equipe e acompanhamento dos vínculos com as aulas.",
        "sections": [
            {
                "title": "Cadastrar e consultar profissionais",
                "paragraphs": [
                    "Acesse Professores para buscar os profissionais e filtrar os cadastros ativos ou inativos. Quando autorizado, use o botão de novo professor para informar nome, função, contato, data de início e foto, conforme os campos disponíveis.",
                    "O cadastro de professor não cria uma conta de login. A conta de autenticação deve ser administrada separadamente."
                ]
            },
            {
                "title": "Perfil profissional",
                "paragraphs": [
                    "Abra o perfil para consultar os dados, editar informações quando autorizado, atualizar a fotografia e verificar o histórico de aulas vinculadas. A desativação preserva o histórico profissional.",
                    "As fotografias dos professores ficam em armazenamento privado. A apresentação institucional pública da equipe não depende da divulgação de seus cadastros internos."
                ]
            },
            {
                "title": "Aulas vinculadas e atuação",
                "paragraphs": [
                    "Os vínculos são registrados no Controle de aulas. O histórico e os relatórios refletem as sessões associadas ao profissional, inclusive as canceladas separadamente.",
                    "A carga horária considera aulas realizadas com duração conhecida. Não corresponde a registro de ponto nem comprova presença profissional por si só."
                ]
            },
            {
                "title": "Relatórios da equipe",
                "paragraphs": [
                    "Em Relatórios, consulte a cobertura das aulas por professores, sessões sem vínculo, aulas em equipe, participação individual e horas por turno. Professores inativos com registros no período continuam compondo o histórico."
                ]
            }
        ]
    },
    {
        "id": "indicadores",
        "title": "Dashboard e indicadores",
        "description": "Painel inicial para acompanhar a situação atual e as atividades do mês.",
        "sections": [
            {
                "title": "Visão geral",
                "paragraphs": [
                    "O Dashboard reúne o total atual de alunos ativos e os indicadores de presenças, faltas e aulas realizadas do mês atual, conforme o fuso de Brasília. Consulte também os últimos cadastros e os aniversariantes exibidos."
                ]
            },
            {
                "title": "Interpretar os números",
                "paragraphs": [
                    "O total de alunos ativos representa o cadastro atual, não a quantidade de pessoas que compareceram no mês. As presenças são participações registradas: um aluno pode contribuir em várias datas.",
                    "Aniversários dependem das datas de nascimento corretas. Se identificar divergência, confira a fonte escolar antes de alterar o cadastro."
                ]
            },
            {
                "title": "Dashboard, Relatórios e site público",
                "paragraphs": [
                    "O Dashboard prioriza o mês atual. Relatórios permite selecionar períodos e analisar os dados com mais detalhes. A página pública mostra somente totais agregados e marcos históricos; seus totais de atividades representam o histórico digital, não todo o projeto desde 2023."
                ]
            }
        ]
    },
    {
        "id": "relatorios",
        "title": "Relatórios e exportações",
        "description": "Análise demográfica, frequência, carga horária, atuação profissional e continuidade.",
        "sections": [
            {
                "title": "Aplicar filtros",
                "paragraphs": [],
                "steps": [
                    "Abra Relatórios.",
                    "Escolha o período, a turma e o turno conforme a análise desejada.",
                    "Aplique os filtros e confira o intervalo exibido antes de interpretar ou exportar."
                ],
                "note": "Alunos ativos, gênero, idade e distribuição por turma representam o cadastro atual, mesmo ao selecionar um período passado. Carga horária e atuação da equipe não são filtradas por turma, pois as sessões não possuem vínculo direto com a turma escolar."
            },
            {
                "title": "Perfil dos alunos",
                "paragraphs": [],
                "items": [
                    "Gênero: Masculino, Feminino e não informado/outro, com quantidades e percentuais.",
                    "Faixa etária: até 5, 6–8, 9–11, 12–14, 15 ou mais e idade não informada/inválida; idade média, mínima e máxima quando disponíveis.",
                    "Turmas: distribuição dos ativos e composição por gênero; cadastros legados sem vínculo escolar podem aparecer separados."
                ]
            },
            {
                "title": "Frequência e evolução",
                "paragraphs": [
                    "Consulte presenças, faltas e percentuais gerais ou por gênero, faixa etária e turma. A idade histórica é calculada na data do registro; gênero e turma históricos usam os dados atuais do cadastro.",
                    "As séries temporais mostram frequência, alunos distintos presentes, presenças, faltas, aulas e carga horária. A granularidade é diária para intervalos curtos e mensal para intervalos maiores."
                ]
            },
            {
                "title": "Retenção e continuidade",
                "paragraphs": [
                    "Compara alunos com pelo menos uma presença em dois períodos consecutivos de mesma duração, limitando o período atual até hoje. A taxa corresponde aos alunos presentes em ambos os períodos ÷ alunos presentes no período anterior × 100.",
                    "Sem retorno registrado não significa evasão. Feriados, férias e registros incompletos podem influenciar a comparação; sem base anterior, a taxa não é interpretável."
                ]
            },
            {
                "title": "Carga horária do projeto",
                "paragraphs": [
                    "Cada aula realizada de manhã ou tarde soma 1h45. Quatro aulas realizadas no dia somam 7h. Cancelamentos são contabilizados separadamente; aulas noturnas sem duração conhecida não entram no total de horas.",
                    "Dias de atividade são datas distintas com pelo menos uma aula realizada. Taxas de realização e cancelamento usam as sessões registradas como base."
                ]
            },
            {
                "title": "Horas-professor e cobertura",
                "paragraphs": [
                    "Consulte professores participantes, aulas com e sem professor vinculado, aulas em equipe, dias de atuação, última aula e carga por turno.",
                    "Exemplo: uma aula de 1h45 com dois professores gera 1h45 de carga do projeto e 3h30 de horas-professor. As horas profissionais são estimativas baseadas nos vínculos, não controle de ponto."
                ]
            },
            {
                "title": "Exportar relatórios",
                "paragraphs": [],
                "steps": [
                    "Confira período, turma e turno.",
                    "Selecione PDF, Excel ou CSV.",
                    "Abra o arquivo gerado e confira o intervalo e os totais antes de compartilhar."
                ],
                "items": [
                    "PDF: documento tabular para leitura e impressão.",
                    "Excel: abas separadas por indicador.",
                    "CSV: dados organizados em seções, para uso em planilhas."
                ],
                "note": "Os relatórios exportam informações agregadas dos estudantes; a atuação profissional pode identificar professores nominalmente. A exportação da lista de alunos é diferente e pode conter dados pessoais."
            }
        ]
    },
    {
        "id": "rotina",
        "title": "Rotina dos professores",
        "description": "Sequência recomendada para manter os dados atualizados.",
        "sections": [
            {
                "title": "Antes das atividades",
                "paragraphs": [],
                "steps": [
                    "Acesse o sistema com sua própria conta.",
                    "Confira a data, os alunos ativos e a turma/turno que participará.",
                    "Verifique a organização dos equipamentos e os combinados pedagógicos."
                ]
            },
            {
                "title": "Durante e após as atividades",
                "paragraphs": [],
                "steps": [
                    "Realize a chamada dos participantes da atividade.",
                    "Registre a sessão com o status correspondente e vincule os professores.",
                    "Confira as faltas antes de confirmar a frequência e corrija inconsistências.",
                    "Verifique se os registros foram salvos."
                ]
            },
            {
                "title": "Acompanhamento periódico",
                "paragraphs": [
                    "Consulte os relatórios por período e converse com a coordenação sobre inconsistências de cadastro, frequência ou vínculos profissionais. Use os indicadores como apoio à reflexão pedagógica, não como avaliação isolada dos estudantes."
                ]
            }
        ]
    },
    {
        "id": "boas-praticas",
        "title": "Segurança e boas práticas",
        "description": "Proteção dos dados, cuidado com imagens e situação da revisão de acesso.",
        "sections": [
            {
                "title": "Contas e acesso",
                "paragraphs": [
                    "Use somente a própria conta autorizada. Não compartilhe senhas nem mantenha sessões abertas em dispositivos de uso coletivo. O cadastro público está desabilitado. Solicite à administração a criação ou retirada de acesso quando necessário."
                ]
            },
            {
                "title": "Dados de crianças e adolescentes",
                "paragraphs": [
                    "Acesse somente informações necessárias ao trabalho. Não copie cadastros, contatos, fotografias ou relatórios para serviços pessoais sem autorização institucional. Não publique registros individuais nem fotografias sem a autorização aplicável.",
                    "Em caso de erro de cadastro, perda de dispositivo ou suspeita de exposição de dados, comunique imediatamente a coordenação ou o responsável institucional."
                ]
            },
            {
                "title": "Armazenamento e publicação",
                "paragraphs": [
                    "Os buckets de fotografias de alunos e professores são privados. O bucket legado alunos também foi privatizado e suas políticas públicas foram retiradas; sua exclusão definitiva depende de conferência da migração. O bucket assets permanece destinado a materiais institucionais públicos.",
                    "Os indicadores públicos são agregados. A publicação de fotografias na landing page deve seguir a autorização institucional."
                ]
            },
            {
                "title": "Situação da segurança",
                "paragraphs": [
                    "RLS está habilitado nas sete tabelas operacionais; o acesso anônimo direto de leitura e o privilégio TRUNCATE autenticado foram restringidos nas verificações realizadas.",
                    "A separação de perfis administrador/professor e a revisão das políticas operacionais estão em andamento. Não considere as permissões por perfil como já implementadas. A interface não substitui as regras de autorização do banco."
                ]
            },
            {
                "title": "Exportações e histórico",
                "paragraphs": [
                    "Prefira relatórios agregados quando não for necessário identificar alunos. Preserve o histórico; evite exclusões e não divulgue arquivos pessoais em canais públicos. Siga os procedimentos de retenção, correção e descarte definidos pela instituição."
                ]
            }
        ]
    },
    {
        "id": "duvidas",
        "title": "Perguntas frequentes",
        "description": "Respostas rápidas e funcionalidades em desenvolvimento.",
        "sections": [
            {
                "title": "Por que Integral aparece na Tarde?",
                "paragraphs": [
                    "Os alunos do Integral participam no período da tarde. A chamada desse turno inclui ambos os grupos."
                ]
            },
            {
                "title": "Posso registrar duas presenças no mesmo dia?",
                "paragraphs": [
                    "Não. A frequência é única por aluno e data, mesmo quando existem várias sessões no turno."
                ]
            },
            {
                "title": "Por que uma foto não aparece?",
                "paragraphs": [
                    "Confira a conexão e o perfil do aluno. A foto principal é obtida do armazenamento privado; se a imagem não carregar, não crie um novo cadastro. Solicite suporte se o problema persistir."
                ]
            },
            {
                "title": "Por que não consigo selecionar uma turma?",
                "paragraphs": [
                    "Confira se a turma está disponível para o ano letivo atual. Se o carregamento falhar, tente novamente. Solicite à coordenação a regularização de turmas ausentes."
                ]
            },
            {
                "title": "Por que o total de horas da equipe é maior que o do projeto?",
                "paragraphs": [
                    "Uma aula compartilhada conta uma única vez para o projeto, mas gera horas para cada professor vinculado."
                ]
            },
            {
                "title": "Por que os números do site não coincidem com um relatório mensal?",
                "paragraphs": [
                    "O site apresenta totais acumulados do histórico digital; o relatório pode considerar somente o período e os filtros selecionados."
                ]
            },
            {
                "title": "O que fazer quando uma operação falha?",
                "paragraphs": [
                    "Confira a conexão, a data e os filtros. Leia a mensagem exibida e verifique se o registro já foi salvo antes de repetir. Se persistir, informe à administração a página e o erro, sem enviar credenciais nem dados pessoais desnecessários."
                ]
            },
            {
                "title": "O que ainda não está disponível?",
                "paragraphs": [
                    "A avaliação pedagógica detalhada e os indicadores de evolução por habilidades estão previstos para uma etapa futura. O carregamento por skeleton foi adiado. A gestão de permissões por perfil e a administração de conteúdo do site ainda não estão concluídas."
                ]
            }
        ]
    }
]
