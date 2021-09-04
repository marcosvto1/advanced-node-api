# Autenticacao com Facebook

> ## Dados
* Token de Acesso

> ## Fluxo Primário

1. Obter dados (nome, email, e Facebook Id) da API do Facebook
2. Consultar se existe um usuário com o email recebido acima
3. Criar uma conta para o usuário com os dados recebidos Facebook
4. Criar um token de acesso, a partir do ID do usuário, com expiração de 30 minutos
5. Retornar o token de acesso gerado

> ## Fluxo Alternativo
3 . Atualizar a conta do usuário com os dados recebidos Facebook (Facebook Id e nome - só atualizar o nome caso a conta do usuário não possua nome)

> ## Fluxo de exceção: Token inválido ou expirado
1. Retornar um erro de autenticação
