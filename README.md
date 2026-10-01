# Grimório Arcano

App de estudo das 78 cartas do tarot (fichas, flashcards e quiz). PWA: pode ser adicionado à tela inicial do celular e funciona offline.

## Como atualizar

1. Edite os arquivos (`index.html`, `cards.js`, imagens em `img/`).
2. Faça o deploy na Netlify (arraste a pasta ou conecte este repositório ao site da Netlify para o deploy ser automático a cada `git push`).
3. Pronto. No celular, basta abrir o app: ele busca a versão nova sozinho e recarrega. Não precisa remover e adicionar à tela de novo.

Não é necessário trocar o número `CACHE` em `sw.js` a cada atualização. Troque só se quiser forçar a limpeza completa do cache antigo.

## Como funciona

- `sw.js`: `index.html`, `cards.js` e o manifest são buscados sempre da rede (cache só como reserva offline). Imagens e ícones ficam em cache permanente.
- `index.html`: quando um service worker novo assume, a página recarrega uma vez; ao voltar para o app, ele verifica se há atualização.
- `_headers`: impede a Netlify e o navegador de guardarem em cache os arquivos que mudam.
