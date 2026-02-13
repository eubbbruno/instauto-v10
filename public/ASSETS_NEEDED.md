# Assets Necessários para Produção

## ⚠️ IMPORTANTE: Criar os seguintes arquivos antes do deploy

### Favicons (obrigatório)
Criar favicons em diferentes tamanhos para compatibilidade com todos os dispositivos:

- **`favicon.ico`** (32x32) - Favicon padrão
- **`favicon-16x16.png`** (16x16) - Favicon pequeno
- **`favicon-32x32.png`** (32x32) - Favicon médio
- **`apple-touch-icon.png`** (180x180) - Ícone para dispositivos Apple
- **`android-chrome-192x192.png`** (192x192) - Ícone para Android
- **`android-chrome-512x512.png`** (512x512) - Ícone para Android (alta resolução)

### Open Graph Image (obrigatório para redes sociais)
- **`og-image.png`** (1200x630) - Imagem que aparece quando o site é compartilhado no Facebook, Twitter, WhatsApp, etc.
  - Deve conter: Logo do Instauto, slogan, e visual atrativo
  - Formato: PNG ou JPG
  - Tamanho: 1200x630 pixels (proporção 1.91:1)

### Como criar os favicons:
1. Use uma ferramenta online como:
   - https://realfavicongenerator.net/
   - https://favicon.io/
2. Faça upload do logo do Instauto
3. Baixe todos os tamanhos gerados
4. Coloque os arquivos na pasta `public/`

### Como criar o OG Image:
1. Use Figma, Canva ou Photoshop
2. Crie um design 1200x630 com:
   - Logo do Instauto
   - Texto: "Encontre a Melhor Oficina Mecânica"
   - Background com gradiente azul (tema do site)
   - Imagem de carro ou oficina (opcional)
3. Exporte como PNG
4. Salve como `public/og-image.png`

## Status Atual
- ✅ `manifest.json` - Criado
- ✅ `robots.txt` - Criado
- ✅ `sitemap.xml` - Criado
- ❌ Favicons - **PENDENTE**
- ❌ OG Image - **PENDENTE**

## Prioridade
1. **Alta**: favicons (necessário para boa UX)
2. **Alta**: og-image.png (necessário para compartilhamento em redes sociais)
