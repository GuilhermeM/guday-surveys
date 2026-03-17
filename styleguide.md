# Guday — Style Guide Visual

> Extraído de guday.com.br em 2026-03-17

---

## Assets de Marca

| Asset | URL |
|-------|-----|
| Logo Branca | https://guday.com.br/cdn/shop/files/logo-white_0e9f1935-0dc9-4be7-93db-04c6a914f011.svg?v=1721891196&width=440 |
| Logo Roxa/Preta | https://guday.com.br/cdn/shop/files/logo-roxo.svg?v=1723934986&width=450 |

---

## Tipografia

| Papel | Fonte | Peso | Observação |
|-------|-------|------|------------|
| Headings | Degular | 600 (semibold) | Fonte premium OH no Type Co. |
| Display / Destaque | Futura 2D Condensed | 800 (extrabold) | Uppercase, impacto visual |
| Body / Geral | Degular | 400 (regular) | Leitura corrida |
| Botões | Degular | 600 | `text-transform: uppercase` |

**Substituto CDN (Google Fonts):** `Plus Jakarta Sans` — mais próxima disponível gratuitamente.

**Tamanhos:** Fluido via `clamp()` — mobile-first, sem breakpoints fixos.

---

## Paleta de Cores

### Principais
| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| Primary Purple | `#B282EB` | `rgb(178, 130, 235)` | Botões, CTAs, destaques |
| Text Dark | `#1E192A` | `rgb(30, 25, 42)` | Texto principal, headings |
| Background | `#FAFAF2` | `rgb(250, 250, 242)` | Fundo de página e cards |

### Secundárias
| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| Secondary Purple | `#A78CEB` | `rgb(167, 140, 235)` | Sucesso, elementos secundários |
| Muted Purple | `#6D6DAA` | `rgb(109, 109, 170)` | Texto secundário, preços riscados |
| Lime Green | `#C5FF89` | `rgb(197, 255, 137)` | Tags promocionais, badges |
| Golden | `#FFBA46` | `rgb(255, 186, 70)` | Estrelas de avaliação |

### Estados
| Estado | Hex | Uso |
|--------|-----|-----|
| Success | `#A78CEB` | Confirmações, ações bem-sucedidas |
| Error Text | `#BE123C` | Mensagens de erro |
| Error Background | `#FFF1F2` | Fundo de alertas de erro |

---

## Componentes

### Botões
```css
border-radius: 0.5rem;     /* 8px — levemente arredondado */
border: none;
box-shadow: 0 6px 0 rgba(0,0,0,0.15);
color: #ffffff;
background: #B282EB;
text-transform: uppercase;
font-weight: 600;
```

### Inputs
```css
border-radius: 3.75rem;    /* 60px — pill shape */
border: 1px solid #e0e0e0;
padding: 0.75rem 1.5rem;
```

### Cards
```css
border-radius: 0;          /* sharp corners */
border: 0.1rem solid #e0e0e0;
box-shadow: 0 2px 8px rgba(0,0,0,0.06);
background: #FAFAF2;
```

---

## Espaçamento

Sistema de 12 pontos modulares com variáveis CSS `--sp-{n}`:

| Escala | Valor |
|--------|-------|
| Micro | 0.125rem – 0.5rem |
| Pequeno | 0.75rem – 1.5rem |
| Médio | 2rem – 4rem |
| Grande | 6rem – 12rem |
| Extra Grande | 16rem – 24rem |

---

## Tom Visual Geral

- Moderno e descontraído, sem ser infantil
- Roxo como identidade central da marca
- Espaço em branco generoso (breathing room)
- Contraste acessível (alinhado com WCAG)
- Mobile-first com design fluido
- CTAs vibrantes: roxo + verde-limão como dupla de ação
