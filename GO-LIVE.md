# Go-live no domínio próprio (saudefrugal.com.br)

Esta branch (`go-live`) já tem o workflow configurado para servir o site na
**raiz do domínio** (sem o `basePath` de preview). Faça o merge dela na `main`
**somente quando** estiver pronto para apontar o domínio — isso **substitui o
site que está no ar hoje**.

## Passo a passo

1. **DNS** (no Cloudflare de `saudefrugal.com.br`):
   - 4 registros **A** no apex `@`:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - 1 registro **CNAME** `www` → `lourealiza.github.io`
   - Durante a verificação, deixe os registros como **DNS only** (nuvem cinza no Cloudflare).

2. **Custom domain no repositório:**
   GitHub → repo → **Settings → Pages → Custom domain** = `saudefrugal.com.br`
   → salvar → aguardar o check verde → marcar **Enforce HTTPS**.

3. **Ativar o build na raiz:**
   Faça o merge desta branch na `main`:
   ```bash
   git checkout main
   git merge go-live
   git push origin main
   ```
   O deploy roda e o site passa a servir na raiz do domínio.

4. **Conferir:** abra https://saudefrugal.com.br — deve carregar estilizado, com
   HTTPS, e as páginas `/cursos`, `/retiros`, `/loja`, `/sobre` funcionando.

## Reverter (se precisar voltar ao preview)
A branch `main` continua em modo subcaminho até o merge. Para voltar atrás,
basta reverter o merge na `main` e remover o custom domain em Settings → Pages.

## Antes do go-live, idealmente
- [ ] Substituir os placeholders pelas fotos reais (Dr. Corassa, retiro, capas)
- [ ] Plugar os links reais de compra (cursos/livros) e o número do WhatsApp
- [ ] Conectar o formulário do e-book a um provedor de e-mail
