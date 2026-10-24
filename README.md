# ISLA-TWA-AlexandreAlmeida-a22505778-
Rep de Tecnologias Web Avançadas - Turma Noite Alexandre Almeida

node -v 
v24.21.0

git -v  
git version 2.55.0.windows.5

npm -v 
11.19.0

Neste Projeto está a ser usado o Gemini e o Claude
    

# Ficha 05 - TWA

## Como correr
1. `npm install`
2. `npm run dev`

## O que está feito
- [x] App.vue dividido em `ItemList`, `ItemDetail` e `ItemForm`.
- [x] Props e emits configurados.
- [x] Formulário com rascunho `reactive`, validação HTML e em Vue (`computed`).
- [x] Composable `useLoad.js` criado com `onMounted`.
- [x] `watch(search)` implementado para limpar a seleção.
- [x] Bónus: Guardar estado de pesquisa em `localStorage`.
- [x] Bónus: Utilização de `<slot>` em `ItemDetail.vue`.

## Declaração de IA
Utilizei um modelo de IA Generativa em casa para me auxiliar na criação da estrutura base dos ficheiros, na separação lógica do Composable, e na formulação dos inputs com validação reativa e envio de eventos (`emit`).

## Respostas de Reflexão
Vantagens da Divisão de Componentes e ReutilizaçãoA divisão da aplicação em múltiplos componentes (como um para a lista, outro para o detalhe e outro para o formulário) permite que cada ficheiro fique responsável por apenas um ecrã ou peça visual.  
O estado da aplicação fica centralizado num só local (o componente pai), enquanto os componentes filhos recebem os dados de que necessitam e reportam o que aconteceu.   Esta separação torna os componentes filhos altamente reutilizáveis; por exemplo, uma lista não precisa de saber como obter os dados (fetch), apenas desenha qualquer array que lhe seja fornecido.   A Proibição de Mutação de PropsUm componente filho lê os dados através de props, mas nunca os deve alterar diretamente, pois esses dados pertencem ao componente pai.   
Alterar uma prop diretamente constitui um erro informático (bug), porque se múltiplos filhos pudessem modificar o mesmo estado partilhado, deixaria de ser possível saber quem alterou o quê.   
Para solicitar uma mudança no estado, o componente filho deve enviar um evento para cima (emit), deixando a decisão final da alteração para o pai.   
Validação no Cliente vs. Validação no ServidorA validação de formulários do lado do cliente (no browser) serve exclusivamente para melhorar a experiência do utilizador (UX), dando respostas rápidas visuais.   
O cliente não é de confiança porque qualquer pessoa pode inspecionar e alterar o código HTML (DOM) ou contornar o browser fazendo um pedido direto à API.   
Por estes motivos, a validação de segurança e as regras que realmente protegem os dados têm de ser obrigatoriamente executadas no servidor.  
A Utilidade dos ComposablesUm composable é uma função que isola a lógica partilhada e devolve um estado reativo, permitindo que blocos de código repetitivos (como a gestão de estados de carregamento, erro e sucesso num fetch) sejam escritos apenas uma vez.   Quando um composable é chamado em diferentes ecrãs, ele cria referências (refs) independentes para cada um, evitando que os estados se misturem enquanto se mantém o código do componente limpo. 
