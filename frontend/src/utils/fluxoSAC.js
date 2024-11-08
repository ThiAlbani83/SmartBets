export const fluxoDepositoB5 = {
  id: 1,
  question: "Pagou e não foi creditado??",
  answers: [
    {
      text: "Sim",
      next: {
        id: 2,
        question: "Acessar a página da PagFast em FINANCEIRO > VENDAS",
        answers: [
          {
            text: "Continuar",
            next: {
              id: 3,
              question: "Depósito com erro?",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 4,
                    question: "CPF de terceiros ou menor de idade?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 5,
                          question:
                            "Informar ao cliente que não é permitido e o valor será reembolsado em até 4hs.",
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 6,
                                question: "Valor foi reembolsado?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 7,
                                      question: "Atendimento encerrado",
                                    },
                                  },
                                  {
                                    text: "Não",
                                    next: {
                                      id: 8,
                                      question:
                                        "Abrir um ticked para o Shift Manager verificar junto ao banco.",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 9,
                          question:
                            "Solicitar comprovante de pagamento e abrir ticket para o Shift Manager.",
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 10,
                                question: "Depósito Concluído?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 11,
                                      question: "Atendimento encerrado",
                                    },
                                  },
                                  {
                                    text: "Não",
                                    next: {
                                      id: 12,
                                      question:
                                        "Verificar o motivo com o Shift Leader a informar o cliente",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      text: "Não",
      next: {
        id: 13,
        question: "Não consegue fazer o depósito?",
        answers: [
          {
            text: "Sim",
            next: {
              id: 14,
              question: "Perfil do cliente tem algum bloqueio?",
              answers: [
                {
                  text: "Sim",
                  next: {
                    id: 15,
                    question: "Bloqueio por fraude?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 16,
                          question:
                            "Informar que a conta foi bloqueada e por esse motivo não é possível fazer depósitos.",
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 17,
                          question: "Cliente configurou limites?",
                          answers: [
                            {
                              text: "Sim",
                              next: {
                                id: 18,
                                question:
                                  "Instruir o cliente sobre como ajustar valores de limite em seu perfil direto pela página.",
                              },
                            },
                            {
                              text: "Não",
                              next: {
                                id: 19,
                                question:
                                  "Não havendo nenhuma observação sobre o bloqueio, abrir ticket para o Shift Manager investigar o ocorrido.",
                                answers: [
                                  {
                                    text: "Continuar",
                                    next: {
                                      id: 20,
                                      question: "Bloqueio mantido?",
                                      answers: [
                                        {
                                          text: "Sim",
                                          next: {
                                            id: 21,
                                            question:
                                              "Informar que a conta foi bloqueada e por esse motivo não é possível fazer depósitos.",
                                          },
                                        },
                                        {
                                          text: "Não",
                                          next: {
                                            id: 22,
                                            question:
                                              "Informar ao cliente que a conta foi liberada para depósito.\n Atendimento finalizado",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  text: "Não",
                  next: {
                    id: 23,
                    question:
                      "Abrir um ticket para o Shift Manager verificar o erro junto ao provedor.",
                    answers: [
                      {
                        text: "Continuar",
                        next: {
                          id: 24,
                          question: "Conseguiu depositar?",
                          answers: [
                            {
                              text: "Sim",
                              next: {
                                id: 25,
                                question: "Atendimento encerrado",
                              },
                            },
                            {
                              text: "Não",
                              next: {
                                id: 26,
                                question: "Retornar ao nó anterior.",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const fluxoSaqueB5 = {
  id: 1,
  question: "Saque Recusado?",
  answers: [
    {
      text: "Sim",
      next: {
        id: 2,
        question: "CPF é a chave Pix?",
        answers: [
          {
            text: "Sim",
            next: {
              id: 3,
              question: "Chave em banco bloqueado?",
              answers: [
                {
                  text: "Sim",
                  next: {
                    id: 4,
                    question:
                      "Orientar o cliente a fazer portabilidade para outro banco e após isso solicitar um novo saque.",
                    answers: [
                      {
                        text: "Continuar",
                        next: {
                          id: 5,
                          question: "Atendimento encerrado",
                        },
                      },
                    ],
                  },
                },
                {
                  text: "Não",
                  next: {
                    id: 6,
                    question: "Fez portabilidade de banco da chave Pix?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 7,
                          question:
                            "Abrir ticket para o Shift Manager pedindo para atualizar a chave pix junto ao banco. Dizer ao cliente para tentar novamente em 24hs.",
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 8,
                          question:
                            "Tem informação sobre o motivo da recusa no site da PagFast?",
                          answers: [
                            {
                              text: "Sim",
                              next: {
                                id: 9,
                                question:
                                  "Orientar o cliente sobre o motivo e pedir o ajuste a ele.",
                              },
                            },
                            {
                              text: "Não",
                              next: {
                                id: 10,
                                question:
                                  "Abrir ticket para o Shift Manager verificar o motivo junto ao banco. Informar o prazo para o cliente de até 24hs.",
                                answers: [
                                  {
                                    text: "Encerrar atendimento",
                                    next: {
                                      id: 11,
                                      question: "Atendimento encerrado",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: "Não",
            next: {
              id: 12,
              question:
                "Orientar cliente que precisa cadastrar o CPF como chave pix em um banco.",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 13,
                    question: "Conseguiu realizar o saque?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 14,
                          question: "Atendimento encerrado",
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 15,
                          question: "Fez portabilidade de banco da chave Pix?",
                          answers: [
                            {
                              text: "Sim",
                              next: {
                                id: 16,
                                question:
                                  "Abrir ticket para o Shift Manager pedindo para atualizar a chave pix junto ao banco. Dizer ao cliente para tentar novamente em 24hs.",
                              },
                            },
                            {
                              text: "Não",
                              next: {
                                id: 17,
                                question:
                                  "Tem informação sobre o motivo da recusa no site da PagFast?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 18,
                                      question:
                                        "Orientar o cliente sobre o motivo e pedir o ajuste a ele.",
                                    },
                                  },
                                  {
                                    text: "Não",
                                    next: {
                                      id: 19,
                                      question:
                                        "Abrir ticket para o Shift Manager verificar o motivo junto ao banco. Informar o prazo para o cliente de até 24hs.",
                                      answers: [
                                        {
                                          text: "Encerrar atendimento",
                                          next: {
                                            id: 20,
                                            question: "Atendimento encerrado",
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      text: "Não",
      next: {
        id: 21,
        question: "Não consegue fazer o saque?",
        answers: [
          {
            text: "Continuar",
            next: {
              id: 22,
              question: "Cumpriu o rollover do depósito?",
              answers: [
                {
                  text: "Sim",
                  next: {
                    id: 23,
                    question:
                      "Saque maior ou menor que o valor diário permitido?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 24,
                          question:
                            "Orientar o cliente quanto aos limites e pedir para tentar novamente.",
                          answers: [
                            {
                              text: "Continuar?",
                              next: {
                                id: 25,
                                question: "Saque realizado?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 26,
                                      question: "Atendimento encerrado",
                                    },
                                  },
                                  {
                                    text: "Não",
                                    next: {
                                      id: 27,
                                      question: "KYC realizado?",
                                      answers: [
                                        {
                                          text: "Sim",
                                          next: {
                                            id: 28,
                                            question:
                                              "Solicitar print do erro e abrir um ticket para o Shift Manager. Informar retorno em até 24hs.",
                                          },
                                        },
                                        {
                                          text: "Não",
                                          next: {
                                            id: 29,
                                            question:
                                              "Informar que precisa realizar o KYC e encaminhar para o cliente link da legitimuz.",
                                            answers: [
                                              {
                                                text: "Continuar",
                                                next: {
                                                  id: 20,
                                                  question: "Conta verificada?",
                                                  answers: [
                                                    {
                                                      text: "Sim",
                                                      next: {
                                                        id: 31,
                                                        question:
                                                          "Conseguiu realizar o saque?",
                                                        answers: [
                                                          {
                                                            text: "Sim",
                                                            next: {
                                                              id: 32,
                                                              question:
                                                                "Atendimento encerrado",
                                                            },
                                                          },
                                                          {
                                                            text: "Não",
                                                            next: {
                                                              id: 33,
                                                              question:
                                                                "Solicitar print do erro e abrir um ticket para o Shift Manager. Informar retorno em até 24hs.",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      text: "Não",
                                                      next: {
                                                        id: 34,
                                                        question:
                                                          "Informar o motivo do erro e orientar o cliente quanto ao procedimento correto.",
                                                        answers: [
                                                          {
                                                            text: "Continuar",
                                                            next: {
                                                              id: 35,
                                                              question:
                                                                "Conseguiu realizar o saque?",
                                                              answers: [
                                                                {
                                                                  text: "Sim",
                                                                  next: {
                                                                    id: 36,
                                                                    question:
                                                                      "Atendimento encerrado",
                                                                  },
                                                                },
                                                                {
                                                                  text: " Não",
                                                                  next: {
                                                                    id: 37,
                                                                    question:
                                                                      "Solicitar print do erro e abrir um ticket para o Shift Manager. Informar retorno em até 24hs.",
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 38,
                          question: "KYC realizado?",
                          answers: [
                            {
                              text: "Sim",
                              next: {
                                id: 39,
                                question:
                                  "Solicitar print do erro e abrir um ticket para o Shift Manager. Informar retorno em até 24hs.",
                              },
                            },
                            {
                              text: "Não",
                              next: {
                                id: 40,
                                question:
                                  "Informar que precisa realizar o KYC e encaminhar para o cliente link da legitimuz.",
                                answers: [
                                  {
                                    text: "Continuar",
                                    next: {
                                      id: 41,
                                      question: "Conta verificada?",
                                      answers: [
                                        {
                                          text: "Sim",
                                          next: {
                                            id: 42,
                                            question:
                                              "Conseguiu realizar o saque?",
                                            answers: [
                                              {
                                                text: "Sim",
                                                next: {
                                                  id: 43,
                                                  question:
                                                    "Atendimento encerrado",
                                                },
                                              },
                                              {
                                                text: "Não",
                                                next: {
                                                  id: 44,
                                                  question:
                                                    "Solicitar print do erro e abrir um ticket para o Shift Manager. Informar retorno em até 24hs.",
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          text: "Não",
                                          next: {
                                            id: 45,
                                            question:
                                              "Informar o motivo do erro e orientar o cliente quanto ao procedimento correto.",
                                            answers: [
                                              {
                                                text: "Continuar",
                                                next: {
                                                  id: 46,
                                                  question:
                                                    "Conseguiu realizar o saque?",
                                                  answers: [
                                                    {
                                                      text: "Sim",
                                                      next: {
                                                        id: 47,
                                                        question:
                                                          "Atendimento encerrado",
                                                      },
                                                    },
                                                    {
                                                      text: "Não",
                                                      next: {
                                                        id: 48,
                                                        question:
                                                          "Solicitar print do erro e abrir um ticket para o Shift Manager. Informar retorno em até 24hs.",
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  text: "Não",
                  next: {
                    id: 49,
                    question:
                      "Informar que precisa cumprir o rollover de 1x o valor do depósito.",
                    answers: [
                      {
                        text: "Encerrar atendimento",
                        next: {
                          id: 50,
                          question: "Atendimento encerrado",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const fluxoBonusB5 = {
  id: 1,
  question: "Bônus de cadastro?",
  answers: [
    {
      text: "Sim",
      next: {
        id: 2,
        question:
          "Bônus de cadastro é um valor recebido no ato do cadastro, sem necessidade de depósito.",
        answers: [
          {
            text: "Continuar",
            next: {
              id: 3,
              question:
                "Encaminhar template >> [Betfive] + [Bônus de Cadastro] esportes. \n Atendimento finalizado",
            },
          },
        ],
      },
    },
    {
      text: "Não",
      next: {
        id: 4,
        question: "Bônus de primeiro depósito?",
        answers: [
          {
            text: "Bônus de cassino",
            next: {
              id: 5,
              question:
                "Para dúvidas, encaminhar template >> [Betfive] + [Bônus Boas-Vindas] cassino.",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 6,
                    question: "Como ver bônus?",
                    answers: [
                      {
                        text: "Continuar",
                        next: {
                          id: 7,
                          question: [
                            "1 - Acessar o site da BetFive",
                            "2 - Consultar o cliente",
                            "3 - Ir em extrato > bônus",
                            "4 - Selecione o período de busca",
                            "5 - Clique em ações e veja os dados",
                          ],
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 8,
                                question: "Converteu bônus?",
                                answers: [
                                  {
                                    text: "Continuar",
                                    next: {
                                      id: 9,
                                      question:
                                        "Veja em observações se há algum comentário que tenha bloqueado o ganho do bônus. Se não houver, informe que o bônus está em revisão, com previsão de até 12hs para liberação.",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: "Bônus de cadastro",
            next: {
              id: 10,
              question:
                "Para dúvidas, encaminhar template >> [Betfive] + [Bônus de Boas Vindas] Esportivo. \n Atendimento finalizado",
              answers: [
                {
                  text: "Continuar?",
                  next: {
                    id: 11,
                    question: "Como ver bônus?",
                    answers: [
                      {
                        text: "Continuar",
                        next: {
                          id: 12,
                          question: [
                            "1 - Acessar o site da BetFive",
                            "2 - Consultar o cliente",
                            "3 - Ir em extrato > bônus",
                            "4 - Selecione o período de busca",
                            "5 - Clique em ações e veja os dados",
                          ],
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 13,
                                question: "Converteu bônus?",
                                answers: [
                                  {
                                    text: "Continuar",
                                    next: {
                                      id: 14,
                                      question:
                                        "Veja em observações se há algum comentário que tenha bloqueado o ganho do bônus. Se não houver, informe que o bônus está em revisão, com previsão de até 12hs para liberação.",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const fluxoBonusJet = {
  id: 1,
  question: "Problema Inicial",
  answers: [
    {
      text: "Não consegue converter",
      next: {
        id: 2,
        question:
          "Verificar no sistema da Weebet em PROMOÇÕES > BÔNUS > LISTAGEM",
        answers: [
          {
            text: "Continuar",
            next: {
              id: 3,
              question: "Status como Completado?",
              answers: [
                {
                  text: "Sim",
                  next: {
                    id: 4,
                    question:
                      "Verificar no sistema weebet em FINANCEIRO > MOVIMENTAÇÕES > CLIENTE se o valor foi adicionado.",
                    answers: [
                      {
                        text: "Continuar",
                        next: {
                          id: 5,
                          question: "Valor Adiconado?",
                          answers: [
                            {
                              text: "Sim",
                              next: {
                                id: 6,
                                question:
                                  "Informar ao cliente que o valor foi devidamente adicionado.",
                              },
                            },
                            {
                              text: "Não",
                              next: {
                                id: 7,
                                question:
                                  "Abrir ticket para o Shift Manager verificar o motivo junto ao banco. Informar o prazo para o cliente de até 24hs.",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  text: "Não",
                  next: {
                    id: 8,
                    question:
                      "Informar o cliente que o bônus ainda está pendente. Neste caso precisa cumprir as regras de rollover.",
                    answers: [
                      {
                        text: "Já cumpriu as Regras?",
                        next: {
                          id: 9,
                          question:
                            "Pedir para cliente ir em PERFIL > PROMOÇÕES > BÔNUS e solicitar que faça o resgate.",
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 10,
                                question:
                                  "Cliente conseguiu realizar o resgate?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 11,
                                      question: "Atendimento encerrado",
                                    },
                                  },
                                  {
                                    text: "Não",
                                    next: {
                                      id: 12,
                                      question:
                                        "Abrir um ticket para o Shift Manager explicando o caso e informar o cliente que o caso será tratado como prioridade.",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      text: "Bônus cancelado",
      next: {
        id: 13,
        question:
          "Verificar no sistema weebet em PROMOÇÕES > BÔNUS > LISTAGEM o motivo do cancelamento e instruir o cliente.",
        answers: [
          {
            text: "Continuar",
            next: {
              id: 14,
              question:
                "Cliente contesta que bônus foi cancelado indevidamente?",
              answers: [
                {
                  text: "Sim",
                  next: {
                    id: 15,
                    question:
                      "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                  },
                },
                {
                  text: " Não",
                  next: {
                    id: 16,
                    question: "Encerrar o atendimento.",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      text: "Não recebeu o bônus.",
      next: {
        id: 17,
        question: "Rodadas Grátis?",
        answers: [
          {
            text: "Sim",
            next: {
              id: 18,
              question:
                "Verificar no sistema weebet em PROMOÇÕES > RODADAS GRÁTIS > LISTAGEM",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 19,
                    question: "Bônus ativado?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 20,
                          question:
                            "Informar ao cliente que bônus foi ativado e explicar o funcionamento.",
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 21,
                          question:
                            "Questionar ao cliente se mais alguém na casa dele já fez cadastro e usou o bônus",
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 22,
                                question: "Já utilizado por outro usuário?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 23,
                                      question:
                                        "Informar que conforme regras, apenas um bônus por IP é permitido.",
                                    },
                                  },
                                  {
                                    text: " Não",
                                    next: {
                                      id: 24,
                                      question:
                                        "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: "Não",
            next: {
              id: 19,
              question:
                "Verificar no sistema weebet em PROMOÇÕES > BÔNUS > LISTAGEM",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 19,
                    question: "Bônus ativado?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 20,
                          question:
                            "Informar ao cliente que bônus foi ativado e explicar o funcionamento.",
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 21,
                          question:
                            "Questionar ao cliente se mais alguém na casa dele já fez cadastro e usou o bônus",
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 22,
                                question: "Já utilizado por outro usuário?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 23,
                                      question:
                                        "Informar que conforme regras, apenas um bônus por IP é permitido.",
                                    },
                                  },
                                  {
                                    text: " Não",
                                    next: {
                                      id: 24,
                                      question:
                                        "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const fluxoSaqueJet = {
  id: 1,
  question: "Problema Inicial",
  answers: [
    {
      text: "Saque Recusado",
      next: {
        id: 2,
        question: "KYC realizado?",
        answers: [
          {
            text: "Sim",
            next: {
              id: 3,
              question: "KYC aprovado?",
              answers: [
                {
                  text: "Sim",
                  next: {
                    id: 4,
                    question:
                      "Verificar no perfil do cliente se há algum comentário sobre o bloqueio dos saques. Se não houver abrir um ticket para o Shift Manager analisar o caso.",
                  },
                },
                {
                  text: "Não",
                  next: {
                    id: 5,
                    question:
                      "Veja motivo no portal Legitimuz e instrua o cliente.",
                  },
                },
              ],
            },
          },
          {
            text: "Não",
            next: {
              id: 6,
              question:
                "Orientar cliente quanto ao procedimento e encaminhar link para verificação.",
            },
          },
        ],
      },
    },
    {
      text: "Saque Pendente",
      next: {
        id: 7,
        question: "Saque pendente",
        answers: [
          {
            text: "Sim",
            next: {
              id: 8,
              question:
                "Verifique no Portal WeeBet o nível do cliente e confirme se há algum limitador de saque",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 9,
                    question: "Possui limitador?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 10,
                          question:
                            "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 11,
                          question: "Saque pago?",
                          answers: [
                            {
                              text: "Sim",
                              next: {
                                id: 12,
                                question: "Encerrar o atendimento",
                              },
                            },
                            {
                              text: "Não",
                              next: {
                                id: 13,
                                question:
                                  "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: "Não",
            next: {
              id: 14,
              question:
                "Se o saque estiver cancelado veja o motivo no portal WeeBet. Peça ao cliente tentar fazer o saque novamente através de outro meio de pagamento",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 15,
                    question: "Saque pago?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 16,
                          question: "Encerrar o atendimento",
                        },
                      },
                      {
                        text: " Não",
                        next: {
                          id: 17,
                          question:
                            "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const fluxoBonusPin = {
  id: 1,
  question: "Problema Inicial",
  answers: [
    {
      text: "Não consegue converter",
      next: {
        id: 2,
        question:
          "Verificar no sistema da Weebet em PROMOÇÕES > BÔNUS > LISTAGEM",
        answers: [
          {
            text: "Continuar",
            next: {
              id: 3,
              question: "Status como Completado?",
              answers: [
                {
                  text: "Sim",
                  next: {
                    id: 4,
                    question:
                      "Verificar no sistema weebet em FINANCEIRO > MOVIMENTAÇÕES > CLIENTE se o valor foi adicionado.",
                    answers: [
                      {
                        text: "Continuar",
                        next: {
                          id: 5,
                          question: "Valor Adiconado?",
                          answers: [
                            {
                              text: "Sim",
                              next: {
                                id: 6,
                                question:
                                  "Informar ao cliente que o valor foi devidamente adicionado.",
                              },
                            },
                            {
                              text: "Não",
                              next: {
                                id: 7,
                                question:
                                  "Abrir ticket para o Shift Manager verificar o motivo junto ao banco. Informar o prazo para o cliente de até 24hs.",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  text: "Não",
                  next: {
                    id: 8,
                    question:
                      "Informar o cliente que o bônus ainda está pendente. Neste caso precisa cumprir as regras de rollover.",
                    answers: [
                      {
                        text: "Já cumpriu as Regras?",
                        next: {
                          id: 9,
                          question:
                            "Pedir para cliente ir em PERFIL > PROMOÇÕES > BÔNUS e solicitar que faça o resgate.",
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 10,
                                question:
                                  "Cliente conseguiu realizar o resgate?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 11,
                                      question: "Atendimento encerrado",
                                    },
                                  },
                                  {
                                    text: "Não",
                                    next: {
                                      id: 12,
                                      question:
                                        "Abrir um ticket para o Shift Manager explicando o caso e informar o cliente que o caso será tratado como prioridade.",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      text: "Bônus cancelado",
      next: {
        id: 13,
        question:
          "Verificar no sistema weebet em PROMOÇÕES > BÔNUS > LISTAGEM o motivo do cancelamento e instruir o cliente.",
        answers: [
          {
            text: "Continuar",
            next: {
              id: 14,
              question:
                "Cliente contesta que bônus foi cancelado indevidamente?",
              answers: [
                {
                  text: "Sim",
                  next: {
                    id: 15,
                    question:
                      "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                  },
                },
                {
                  text: " Não",
                  next: {
                    id: 16,
                    question: "Encerrar o atendimento.",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      text: "Não recebeu o bônus.",
      next: {
        id: 17,
        question: "Rodadas Grátis?",
        answers: [
          {
            text: "Sim",
            next: {
              id: 18,
              question:
                "Verificar no sistema weebet em PROMOÇÕES > RODADAS GRÁTIS > LISTAGEM",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 19,
                    question: "Bônus ativado?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 20,
                          question:
                            "Informar ao cliente que bônus foi ativado e explicar o funcionamento.",
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 21,
                          question:
                            "Questionar ao cliente se mais alguém na casa dele já fez cadastro e usou o bônus",
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 22,
                                question: "Já utilizado por outro usuário?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 23,
                                      question:
                                        "Informar que conforme regras, apenas um bônus por IP é permitido.",
                                    },
                                  },
                                  {
                                    text: " Não",
                                    next: {
                                      id: 24,
                                      question:
                                        "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: "Não",
            next: {
              id: 19,
              question:
                "Verificar no sistema weebet em PROMOÇÕES > BÔNUS > LISTAGEM",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 19,
                    question: "Bônus ativado?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 20,
                          question:
                            "Informar ao cliente que bônus foi ativado e explicar o funcionamento.",
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 21,
                          question:
                            "Questionar ao cliente se mais alguém na casa dele já fez cadastro e usou o bônus",
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 22,
                                question: "Já utilizado por outro usuário?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 23,
                                      question:
                                        "Informar que conforme regras, apenas um bônus por IP é permitido.",
                                    },
                                  },
                                  {
                                    text: " Não",
                                    next: {
                                      id: 24,
                                      question:
                                        "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const fluxoDepositosJet = {
  id: 1,
  question: "Pago por um terceiro?",
  answers: [
    {
      text: "Sim",
      next: {
        id: 2,
        question:
          "Informar que o banco reeembolsará o valor, pois não é permitido pagamento por terceiros.",
      },
    },
    {
      text: "Não",
      next: {
        id: 3,
        question: "Solicite o comprovante de depósito",
        answers: [
          {
            text: "Continuar",
            next: {
              id: 4,
              question:
                "Antes de abrir ticket, verifique se o pagamento é para a PrimePag ou Paag.",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 5,
                    question: "Pagamento feito para Paag ou PrimePag",
                    answers: [
                      {
                        text: "Continuar",
                        next: {
                          id: 6,
                          question:
                            "Informar o cliente que o pagamento não foi feito para nós, neste caso precisa encaminhar o comprovante correto.",
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 7,
                                question: "Recebeu o comprovante correto?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 8,
                                      question:
                                        "Verificar no sistema se o depósito reclamado está pendente",
                                      answers: [
                                        {
                                          text: "Continuar",
                                          next: {
                                            id: 9,
                                            question: "Status pendente?",
                                            answers: [
                                              {
                                                text: "Sim",
                                                next: {
                                                  id: 10,
                                                  question:
                                                    "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                                                },
                                              },
                                              {
                                                text: "Não",
                                                next: {
                                                  id: 11,
                                                  question:
                                                    "Informar ao cliente que o depósito foi concluído. Vá em FINANCEIRO > MOVIMENTAÇÕES > CLIENTE e veja se o saldo foi consumido em apostas.",
                                                  answers: [
                                                    {
                                                      text: "Continuar",
                                                      next: {
                                                        id: 12,
                                                        question:
                                                          "Saldo consumido em apostas?",
                                                        answers: [
                                                          {
                                                            text: "Sim",
                                                            next: {
                                                              id: 13,
                                                              question:
                                                                "Explicar ao cliente sobre consumo do saldo de forma devida.",
                                                            },
                                                          },
                                                          {
                                                            text: " Não",
                                                            next: {
                                                              id: 14,
                                                              question:
                                                                "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    text: "Não",
                                    next: {
                                      id: 15,
                                      question:
                                        "Instruir cliente para verificar o pagamento e se localizar o comprovante correto nos contatar",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const fluxoDepositosPin = {
  id: 1,
  question: "Pago por um terceiro?",
  answers: [
    {
      text: "Sim",
      next: {
        id: 2,
        question:
          "Informar que o banco reeembolsará o valor, pois não é permitido pagamento por terceiros.",
      },
    },
    {
      text: "Não",
      next: {
        id: 3,
        question: "Solicite o comprovante de depósito",
        answers: [
          {
            text: "Continuar",
            next: {
              id: 4,
              question:
                "Antes de abrir ticket, verifique se o pagamento é para a PrimePag ou Paag.",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 5,
                    question: "Pagamento feito para Paag ou PrimePag",
                    answers: [
                      {
                        text: "Continuar",
                        next: {
                          id: 6,
                          question:
                            "Informar o cliente que o pagamento não foi feito para nós, neste caso precisa encaminhar o comprovante correto.",
                          answers: [
                            {
                              text: "Continuar",
                              next: {
                                id: 7,
                                question: "Recebeu o comprovante correto?",
                                answers: [
                                  {
                                    text: "Sim",
                                    next: {
                                      id: 8,
                                      question:
                                        "Verificar no sistema se o depósito reclamado está pendente",
                                      answers: [
                                        {
                                          text: "Continuar",
                                          next: {
                                            id: 9,
                                            question: "Status pendente?",
                                            answers: [
                                              {
                                                text: "Sim",
                                                next: {
                                                  id: 10,
                                                  question:
                                                    "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                                                },
                                              },
                                              {
                                                text: "Não",
                                                next: {
                                                  id: 11,
                                                  question:
                                                    "Informar ao cliente que o depósito foi concluído. Vá em FINANCEIRO > MOVIMENTAÇÕES > CLIENTE e veja se o saldo foi consumido em apostas.",
                                                  answers: [
                                                    {
                                                      text: "Continuar",
                                                      next: {
                                                        id: 12,
                                                        question:
                                                          "Saldo consumido em apostas?",
                                                        answers: [
                                                          {
                                                            text: "Sim",
                                                            next: {
                                                              id: 13,
                                                              question:
                                                                "Explicar ao cliente sobre consumo do saldo de forma devida.",
                                                            },
                                                          },
                                                          {
                                                            text: " Não",
                                                            next: {
                                                              id: 14,
                                                              question:
                                                                "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    text: "Não",
                                    next: {
                                      id: 15,
                                      question:
                                        "Instruir cliente para verificar o pagamento e se localizar o comprovante correto nos contatar",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const fluxoSaquePin = {
  id: 1,
  question: "Problema Inicial",
  answers: [
    {
      text: "Saque Recusado",
      next: {
        id: 2,
        question: "KYC realizado?",
        answers: [
          {
            text: "Sim",
            next: {
              id: 3,
              question: "KYC aprovado?",
              answers: [
                {
                  text: "Sim",
                  next: {
                    id: 4,
                    question:
                      "Verificar no perfil do cliente se há algum comentário sobre o bloqueio dos saques. Se não houver abrir um ticket para o Shift Manager analisar o caso.",
                  },
                },
                {
                  text: "Não",
                  next: {
                    id: 5,
                    question:
                      "Veja motivo no portal Legitimuz e instrua o cliente.",
                  },
                },
              ],
            },
          },
          {
            text: "Não",
            next: {
              id: 6,
              question:
                "Orientar cliente quanto ao procedimento e encaminhar link para verificação.",
            },
          },
        ],
      },
    },
    {
      text: "Saque Pendente",
      next: {
        id: 7,
        question: "Saque pendente",
        answers: [
          {
            text: "Sim",
            next: {
              id: 8,
              question:
                "Verifique no Portal WeeBet o nível do cliente e confirme se há algum limitador de saque",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 9,
                    question: "Possui limitador?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 10,
                          question:
                            "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                        },
                      },
                      {
                        text: "Não",
                        next: {
                          id: 11,
                          question: "Saque pago?",
                          answers: [
                            {
                              text: "Sim",
                              next: {
                                id: 12,
                                question: "Encerrar o atendimento",
                              },
                            },
                            {
                              text: "Não",
                              next: {
                                id: 13,
                                question:
                                  "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: "Não",
            next: {
              id: 14,
              question:
                "Se o saque estiver cancelado veja o motivo no portal WeeBet. Peça ao cliente tentar fazer o saque novamente através de outro meio de pagamento",
              answers: [
                {
                  text: "Continuar",
                  next: {
                    id: 15,
                    question: "Saque pago?",
                    answers: [
                      {
                        text: "Sim",
                        next: {
                          id: 16,
                          question: "Encerrar o atendimento",
                        },
                      },
                      {
                        text: " Não",
                        next: {
                          id: 17,
                          question:
                            "Abra Ticket para Shift Manager explicando o caso e informe o cliente que o caso será tratando com prioridade.",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
