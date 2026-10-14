# SEO técnico — Maribela

Domínio canônico: https://www.maribela.com.br

- Sitemap: `/sitemap.xml`, gerado com dados atuais por requisição. Falha de banco não é escondida como sitemap vazio.
- Robots: `/robots.txt`. Bloqueia `/api/`; páginas operacionais e administrativas ficam rastreáveis para leitura de `X-Robots-Tag: noindex, nofollow`. Isso não concede acesso nem substitui autenticação.
- Páginas públicas com dados de banco usam renderização por requisição. `React.cache` evita consultas repetidas no mesmo render; não cria cache persistente. Publicação, edição e exclusão refletem na próxima requisição sem alterar APIs administrativas.
- `/loja/categoria/todos` permanece funcional, com canonical `/loja`; filtros/parâmetros não são removidos por redirecionamentos.
- A preferência por `www` já existe na hospedagem. Não foi alterada nem replicada em middleware de autenticação. A mudança de 307 para redirecionamento permanente depende da configuração Vercel.

## Catálogo: aprovação explícita e sem migração

O modelo Product não possui publicação/rascunho. Por isso `src/client/config/catalog-seo.config.ts` mantém uma lista vazia de slugs explicitamente revisados. Cadastros continuam acessíveis na loja, mas não são presumidos como publicados para SEO.

Para indexação, o slug deve estar nessa lista e o produto deve ter nome, descrição, imagem HTTPS válida, preço positivo e estoque positivo. A mesma regra é usada no sitemap, robots metadata e schema Product. Categorias de produtos só são indexáveis se contiverem ao menos um produto elegível. Categorias editoriais exigem conteúdo publicado. Categorias vazias permanecem acessíveis com noindex.

O catálogo atual não precisa ser preenchido. Quando produtos reais forem aprovados, seus slugs devem ser incluídos na lista em uma alteração de configuração. Isso não altera estoque/preço nem representa uma publicação automática pelo painel. O controle por campo de publicação no banco fica para uma etapa futura. Produtos indisponíveis continuam acessíveis, mas saem do sitemap e recebem noindex enquanto não satisfazem a regra.

## Dados estruturados e conteúdo

Organization, WebSite, BreadcrumbList e BlogPosting usam dados existentes. Product é emitido somente para produtos elegíveis. JSON-LD escapa caracteres que poderiam fechar a tag script. Não são gerados avaliações, endereço, frete, políticas, autor ou datas de publicação presumidas. Post tem createdAt e updatedAt, mas não data de publicação; o schema usa somente dateModified. Autor/dataPublished poderão ser acrescentados quando houver campos confiáveis.

Open Graph e Twitter usam a foto existente `/hero-maribela.jpg` como fallback, sem dimensões inventadas. As imagens próprias de produtos/artigos são utilizadas quando disponíveis.

Os links jurídicos sem páginas equivalentes foram retirados do rodapé. Perguntas de encomendas apontam para `/personalizado`. Conteúdo de privacidade, termos e trocas/devoluções continua pendente de fornecimento/aprovação pela cliente; nenhum texto jurídico foi inventado.

## Preservação e validação

Consulta email/CPF, APIs individuais de pedidos, checkout, pagamentos, webhooks, autenticação 0A, banco e dependências não foram alterados. Noindex não corrige as vulnerabilidades comerciais que permanecem para etapas posteriores.

Executar testes sem dados de produção:

```text
node --import tsx --test tests/security.test.mjs tests/seo.test.mjs
node --import tsx --test tests/seo-http.test.mjs
```

Os testes usam consultas em memória e rede desabilitada. A homologação HTTP local utiliza o build com um banco de teste indisponível, sem requisições a pedidos reais. Nenhum comando de seed ou migração deve ser executado para validar SEO.

A rota alternativa legada `/pedido/[orderId]`, fora do layout público, apresentou HTTP 500 no teste local (`useCart must be used within CartProvider`). O arquivo permanece idêntico ao commit 0A, conforme a restrição de não alterar consultas de pedidos. O fluxo atual de checkout usa `/loja/pedido/[id]`. A correção da rota legada deve ser avaliada na etapa específica de pedidos; seus cabeçalhos noindex foram configurados sem alterar a página.

Após um deploy autorizado separadamente, enviar o sitemap à propriedade de domínio `maribela.com.br` no Search Console. A implementação não comprova indexação pelo Google.
