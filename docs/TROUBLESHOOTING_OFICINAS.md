# 🔧 TROUBLESHOOTING - Página /oficinas

## 🐛 **PROBLEMA RELATADO**

Ao clicar em "Para Oficinas" no menu ou acessar diretamente `/oficinas`, a página redireciona para a home (`/`).

---

## ✅ **VERIFICAÇÕES REALIZADAS**

### 1. **Arquivo existe e está correto**
- ✅ `app/oficinas/page.tsx` existe
- ✅ É um componente válido do Next.js
- ✅ Exporta `default function OficinasPage()`

### 2. **Links estão corretos**
- ✅ `components/layout/Header.tsx` → `href="/oficinas"`
- ✅ `components/layout/Footer.tsx` → `href="/oficinas"`
- ✅ Nenhum typo ou erro de digitação

### 3. **Middleware NÃO está bloqueando**
- ✅ Middleware só bloqueia: `/motorista`, `/oficina`, `/completar-cadastro`
- ✅ `/oficinas` (público) NÃO está na lista de rotas protegidas
- ✅ Middleware está configurado corretamente

### 4. **Build está OK**
```bash
npm run build
# ✅ Sucesso!
# ○ /oficinas (Static) - Gerado corretamente
```

---

## 🔍 **POSSÍVEIS CAUSAS**

### **1. Cache do Navegador** (MAIS PROVÁVEL)
O navegador pode estar usando uma versão antiga em cache.

**Solução:**
```
Chrome/Edge: Ctrl + Shift + R (Windows) ou Cmd + Shift + R (Mac)
Firefox: Ctrl + F5
```

### **2. Cache do Next.js**
A pasta `.next` pode ter cache antigo.

**Solução:**
```bash
# Deletar pasta .next
Remove-Item -Recurse -Force .next  # PowerShell
rm -rf .next  # Bash/Linux/Mac

# Rebuild
npm run dev
```

### **3. Deploy antigo na Vercel**
O deploy na Vercel pode estar desatualizado.

**Solução:**
- Verificar último deploy em: https://vercel.com/dashboard
- Forçar novo deploy: `git push`
- Aguardar 1-2 minutos para deploy completar

### **4. Service Worker**
Se o site usa Service Worker, pode estar cacheando rotas antigas.

**Solução:**
```javascript
// No DevTools (F12) → Application → Service Workers → Unregister
```

---

## 🚀 **SOLUÇÕES APLICADAS**

### **1. Limpeza de Cache Local**
```bash
# Deletar .next
Remove-Item -Recurse -Force .next

# Reiniciar servidor
npm run dev
```

### **2. Servidor Local Funcionando**
```
✓ Ready in 1032ms
Local: http://localhost:3000
```

### **3. Teste Local**
Acesse: http://localhost:3000/oficinas

**Deve funcionar!** ✅

---

## 📋 **CHECKLIST DE TESTE**

### **Teste 1: Local**
- [ ] Acesse http://localhost:3000
- [ ] Clique em "Para Oficinas" no menu
- [ ] Deve abrir http://localhost:3000/oficinas
- [ ] Página deve carregar corretamente

### **Teste 2: Produção (Vercel)**
- [ ] Acesse https://instauto-v10.vercel.app
- [ ] Limpe cache do navegador (Ctrl+Shift+R)
- [ ] Clique em "Para Oficinas" no menu
- [ ] Deve abrir https://instauto-v10.vercel.app/oficinas
- [ ] Página deve carregar corretamente

### **Teste 3: Aba Anônima**
- [ ] Abra aba anônima/privada
- [ ] Acesse https://instauto-v10.vercel.app/oficinas diretamente
- [ ] Página deve carregar sem redirecionamento

---

## 🎯 **SE AINDA NÃO FUNCIONAR**

### **Opção 1: Renomear a pasta**
```bash
# Renomear temporariamente
mv app/oficinas app/oficinas-temp
mv app/oficinas-temp app/oficinas

# Commit e push
git add .
git commit -m "Fix: Force rebuild oficinas route"
git push
```

### **Opção 2: Criar rota alternativa**
```bash
# Criar em outro local
app/para-oficinas/page.tsx

# Atualizar links
/oficinas → /para-oficinas
```

### **Opção 3: Verificar conflito de rotas**
Verificar se não há:
- `app/oficinas/layout.tsx` (não deve existir)
- `app/oficinas/[...slug]/page.tsx` (catch-all route)
- Redirect em `next.config.js`

---

## 📊 **ESTRUTURA ATUAL**

```
app/
├── oficinas/
│   └── page.tsx ✅ (Landing page pública)
│
├── (dashboard)/oficina/
│   └── page.tsx ✅ (Dashboard protegido)
│
└── (motorista)/motorista/oficinas/
    └── page.tsx ✅ (Buscar oficinas - motorista)
```

**NÃO HÁ CONFLITO!** Cada rota é única e distinta.

---

## 🔧 **COMANDOS ÚTEIS**

```bash
# Limpar cache e rebuild
Remove-Item -Recurse -Force .next
npm run dev

# Build de produção
npm run build

# Verificar rotas geradas
npm run build | grep "oficinas"

# Forçar deploy na Vercel
git push
```

---

## 📞 **SUPORTE**

Se nenhuma solução funcionar:
1. Tire screenshot do erro
2. Abra DevTools (F12) → Console
3. Verifique erros no console
4. Compartilhe o erro completo

---

*Última atualização: Janeiro 17, 2026*
