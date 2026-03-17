# Cupom TikTok → Shopify: Documentação de Progresso

**Data:** 2026-03-17
**Status:** Planejamento concluído, implementação pendente

---

## Contexto do Projeto

Clientes compram no **TikTok Shop** e recebem um QR code que leva a uma landing page. Nessa página, o cliente preenche seus dados e resgata um cupom de produto grátis para usar na próxima compra acima de R$199 na Shopify.

**Problema central:** Garantir que cada pessoa use o cupom apenas uma vez, sem vazar um código geral.

---

## Decisões Tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| Controle de unicidade | CPF hasheado (SHA-256) | Impede múltiplos resgates mesmo com e-mails diferentes |
| Banco de dados | Supabase | Gratuito, fácil, tem Edge Functions |
| Geração do cupom | Shopify Admin API nativa | Sem app pago, 0 custo extra |
| Entrega do cupom | E-mail (Resend ou SendGrid) | Registro + conveniência |

---

## Arquitetura Definida

```
QR Code → Landing Page → Form (nome / email / telefone / CPF)
    → Backend valida CPF (já usado?)
    → Shopify Admin API gera código único
    → Código exibido na tela + enviado por e-mail
```

### Stack
- **Landing page:** HTML simples (pode ser neste repo ou página Shopify)
- **Backend/API:** Supabase Edge Functions ou Vercel Serverless
- **Banco:** Supabase (tabela `resgates`)
- **Cupom:** Shopify Admin API (nativa, sem app instalado)

---

## Shopify: O Que Fazer

### Passo 1 — Criar Custom App (5 min)
1. Shopify Admin → Settings → Apps and sales channels
2. Develop apps → Create an app → nome: "Cupom TikTok"
3. Permissões necessárias:
   - `write_price_rules`
   - `write_discounts`
4. Install app → copiar o **Admin API access token**

### Passo 2 — Criar a Price Rule (feito 1 vez)
Pode ser pelo painel (Discounts → Buy X Get Y) ou via API:

```bash
curl -X POST \
  "https://SUA-LOJA.myshopify.com/admin/api/2024-01/price_rules.json" \
  -H "X-Shopify-Access-Token: SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price_rule": {
      "title": "Cupom TikTok Produto Gratis",
      "target_type": "line_item",
      "value_type": "percentage",
      "value": "-100.0",
      "usage_limit": 10000,
      "once_per_customer": true,
      "prerequisite_subtotal_range": {
        "greater_than_or_equal_to": "199.00"
      },
      "starts_at": "2026-03-17T00:00:00Z"
    }
  }'
```

Salvar o `price_rule_id` retornado — necessário para gerar os códigos.

### Passo 3 — Gerar Código Único por Pessoa
```bash
curl -X POST \
  "https://SUA-LOJA.myshopify.com/admin/api/2024-01/price_rules/{PRICE_RULE_ID}/discount_codes.json" \
  -H "X-Shopify-Access-Token: SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"discount_code": {"code": "TIKTOK-ABC123"}}'
```

---

## Supabase: Tabela Necessária

```sql
CREATE TABLE resgates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cpf_hash text UNIQUE NOT NULL,  -- SHA-256 do CPF limpo (só números)
  nome text,
  email text,
  telefone text,
  codigo_shopify text,
  resgatado_em timestamptz DEFAULT now()
);
```

---

## Lógica do Backend

```js
async function handleCouponRequest({ nome, email, telefone, cpf }) {
  const cpfHash = sha256(cpf.replace(/\D/g, ''))

  // 1. Checa se CPF já resgatou
  const existing = await supabase
    .from('resgates')
    .select('id')
    .eq('cpf_hash', cpfHash)
    .single()

  if (existing.data) {
    return { error: 'CPF já utilizou este cupom' }
  }

  // 2. Gera código único na Shopify
  const code = `TIKTOK-${nanoid(6).toUpperCase()}`
  await shopify.post(`/price_rules/${PRICE_RULE_ID}/discount_codes.json`, {
    discount_code: { code }
  })

  // 3. Salva no banco
  await supabase.from('resgates').insert({
    cpf_hash: cpfHash,
    nome, email, telefone,
    codigo_shopify: code,
  })

  // 4. Envia por e-mail (opcional mas recomendado)
  await sendEmail({ to: email, code })

  return { code }
}
```

---

## Camadas de Proteção

1. **CPF hasheado no banco** — bloqueia resgate duplicado na nossa base
2. **`usage_limit: 1` no código Shopify** — o código só funciona uma vez no checkout
3. **`once_per_customer: true` na Price Rule** — Shopify bloqueia pelo e-mail da conta
4. **Rate limiting na API** — evita abuso automatizado

---

## Próximos Passos (em ordem)

- [ ] Definir qual produto será dado como brinde
- [ ] Criar o Custom App no Shopify e guardar o token
- [ ] Criar a Price Rule e guardar o `price_rule_id`
- [ ] Criar projeto no Supabase e rodar o SQL da tabela `resgates`
- [ ] Implementar o backend (Edge Function ou Vercel)
- [ ] Implementar a landing page com o formulário
- [ ] Testar fluxo completo com CPF de teste
- [ ] Gerar e imprimir o QR Code apontando para a URL da landing page

---

## Custo Estimado

| Serviço | Custo |
|---|---|
| Shopify Admin API | R$ 0 (nativo) |
| Supabase (até 50k rows) | R$ 0 (free tier) |
| Vercel (serverless) | R$ 0 (free tier) |
| Resend (até 3k emails/mês) | R$ 0 (free tier) |
| **Total** | **R$ 0** |
