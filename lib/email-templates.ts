// Templates de e-mails transacionais para o Instauto

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function getWelcomeEmail(name: string, workshopName?: string): EmailTemplate {
  const displayName = workshopName || name;
  
  return {
    subject: "Bem-vindo ao Instauto! 🚗",
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao Instauto</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                      Bem-vindo ao Instauto! 🚗
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Olá <strong>${displayName}</strong>,
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Estamos muito felizes em ter você conosco! Sua conta foi criada com sucesso e você já pode começar a usar o Instauto.
                    </p>
                    
                    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                      <p style="color: #1e40af; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                        🎉 Teste PRO por 14 dias grátis!
                      </p>
                      <p style="color: #1e3a8a; font-size: 14px; line-height: 1.6; margin: 0;">
                        Você tem acesso completo a todas as funcionalidades PRO por 14 dias. Sem cartão de crédito, sem compromisso.
                      </p>
                    </div>
                    
                    <h3 style="color: #111827; font-size: 20px; font-weight: bold; margin: 30px 0 15px 0;">
                      Primeiros Passos:
                    </h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0;">
                          <div style="display: flex; align-items: start;">
                            <span style="color: #3b82f6; font-size: 24px; font-weight: bold; margin-right: 12px;">1.</span>
                            <span style="color: #374151; font-size: 15px; line-height: 1.6;">Configure os dados da sua oficina</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <div style="display: flex; align-items: start;">
                            <span style="color: #3b82f6; font-size: 24px; font-weight: bold; margin-right: 12px;">2.</span>
                            <span style="color: #374151; font-size: 15px; line-height: 1.6;">Cadastre seus primeiros clientes e veículos</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <div style="display: flex; align-items: start;">
                            <span style="color: #3b82f6; font-size: 24px; font-weight: bold; margin-right: 12px;">3.</span>
                            <span style="color: #374151; font-size: 15px; line-height: 1.6;">Crie sua primeira ordem de serviço</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <div style="display: flex; align-items: start;">
                            <span style="color: #3b82f6; font-size: 24px; font-weight: bold; margin-right: 12px;">4.</span>
                            <span style="color: #374151; font-size: 15px; line-height: 1.6;">Explore todas as funcionalidades</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="https://www.instauto.com.br/oficina" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #111827; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);">
                        Acessar Meu Dashboard
                      </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                      Precisa de ajuda? Estamos aqui para você!<br>
                      📧 <a href="mailto:contato@instauto.com.br" style="color: #3b82f6; text-decoration: none;">contato@instauto.com.br</a><br>
                      📱 <a href="tel:+5543991852779" style="color: #3b82f6; text-decoration: none;">+55 (43) 99185-2779</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 0;">
                      © ${new Date().getFullYear()} Instauto. Todos os direitos reservados.<br>
                      Londrina, PR - Brasil
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Bem-vindo ao Instauto! 🚗

Olá ${displayName},

Estamos muito felizes em ter você conosco! Sua conta foi criada com sucesso e você já pode começar a usar o Instauto.

🎉 Teste PRO por 14 dias grátis!
Você tem acesso completo a todas as funcionalidades PRO por 14 dias. Sem cartão de crédito, sem compromisso.

Primeiros Passos:
1. Configure os dados da sua oficina
2. Cadastre seus primeiros clientes e veículos
3. Crie sua primeira ordem de serviço
4. Explore todas as funcionalidades

Acesse agora: https://www.instauto.com.br/oficina

Precisa de ajuda? Estamos aqui para você!
📧 contato@instauto.com.br
📱 +55 (43) 99185-2779

© ${new Date().getFullYear()} Instauto. Todos os direitos reservados.
Londrina, PR - Brasil
    `.trim(),
  };
}

export function getPasswordResetEmail(resetLink: string): EmailTemplate {
  return {
    subject: "Recuperação de Senha - Instauto",
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                      🔐 Recuperação de Senha
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Olá,
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Recebemos uma solicitação para redefinir a senha da sua conta no Instauto.
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Clique no botão abaixo para criar uma nova senha:
                    </p>
                    
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                        Redefinir Minha Senha
                      </a>
                    </div>
                    
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 8px;">
                      <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0;">
                        <strong>⚠️ Importante:</strong> Este link expira em 1 hora por segurança. Se você não solicitou esta alteração, ignore este e-mail.
                      </p>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                      Se o botão não funcionar, copie e cole este link no seu navegador:<br>
                      <a href="${resetLink}" style="color: #3b82f6; text-decoration: none; word-break: break-all;">${resetLink}</a>
                    </p>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                      Precisa de ajuda?<br>
                      📧 <a href="mailto:contato@instauto.com.br" style="color: #3b82f6; text-decoration: none;">contato@instauto.com.br</a><br>
                      📱 <a href="tel:+5543991852779" style="color: #3b82f6; text-decoration: none;">+55 (43) 99185-2779</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 0;">
                      © ${new Date().getFullYear()} Instauto. Todos os direitos reservados.<br>
                      Londrina, PR - Brasil
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
🔐 Recuperação de Senha - Instauto

Olá,

Recebemos uma solicitação para redefinir a senha da sua conta no Instauto.

Clique no link abaixo para criar uma nova senha:
${resetLink}

⚠️ Importante: Este link expira em 1 hora por segurança. Se você não solicitou esta alteração, ignore este e-mail.

Precisa de ajuda?
📧 contato@instauto.com.br
📱 +55 (43) 99185-2779

© ${new Date().getFullYear()} Instauto. Todos os direitos reservados.
Londrina, PR - Brasil
    `.trim(),
  };
}

export function getTrialEndingEmail(name: string, daysLeft: number): EmailTemplate {
  return {
    subject: `Seu teste PRO termina em ${daysLeft} dias - Instauto`,
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seu teste está terminando</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                      ⏰ Seu teste PRO está terminando
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Olá <strong>${name}</strong>,
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Seu teste grátis de 14 dias do plano PRO termina em <strong>${daysLeft} dias</strong>.
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Continue aproveitando todas as funcionalidades PRO por apenas <strong>R$ 97/mês</strong>:
                    </p>
                    
                    <ul style="color: #374151; font-size: 15px; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                      <li>Clientes e ordens de serviço ilimitados</li>
                      <li>Controle completo de estoque</li>
                      <li>Gestão financeira avançada</li>
                      <li>Relatórios e gráficos</li>
                      <li>Diagnóstico com IA (GPT-4)</li>
                      <li>Integração WhatsApp</li>
                    </ul>
                    
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="https://www.instauto.com.br/oficina/configuracoes?tab=plano" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #111827; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);">
                        Continuar com o Plano PRO
                      </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                      Não quer continuar? Sem problemas! Você será automaticamente<br>
                      transferido para o plano FREE e seus dados ficarão salvos.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 0;">
                      © ${new Date().getFullYear()} Instauto. Todos os direitos reservados.<br>
                      Londrina, PR - Brasil
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
⏰ Seu teste PRO está terminando - Instauto

Olá ${name},

Seu teste grátis de 14 dias do plano PRO termina em ${daysLeft} dias.

Continue aproveitando todas as funcionalidades PRO por apenas R$ 97/mês:
- Clientes e ordens de serviço ilimitados
- Controle completo de estoque
- Gestão financeira avançada
- Relatórios e gráficos
- Diagnóstico com IA (GPT-4)
- Integração WhatsApp

Continuar com o Plano PRO:
https://www.instauto.com.br/oficina/configuracoes?tab=plano

Não quer continuar? Sem problemas! Você será automaticamente transferido para o plano FREE e seus dados ficarão salvos.

© ${new Date().getFullYear()} Instauto. Todos os direitos reservados.
Londrina, PR - Brasil
    `.trim(),
  };
}

