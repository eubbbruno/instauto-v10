import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📨 [Email API] REQUISIÇÃO RECEBIDA");
    
    const body = await request.json();
    const { to, subject, type, data } = body;

    console.log("📨 [Email API] Destinatário:", to);
    console.log("📨 [Email API] Assunto:", subject);
    console.log("📨 [Email API] Tipo:", type);
    console.log("📨 [Email API] Dados:", JSON.stringify(data, null, 2));

    // Verificar se API key está configurada
    console.log("📨 [Email API] Verificando RESEND_API_KEY...");
    console.log("📨 [Email API] API Key presente?", !!process.env.RESEND_API_KEY);
    console.log("📨 [Email API] API Key (primeiros 10 chars):", process.env.RESEND_API_KEY?.substring(0, 10) + "...");
    
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ [Email API] RESEND_API_KEY não configurada. Email não será enviado.');
      return NextResponse.json({ 
        success: false, 
        message: 'API key não configurada' 
      }, { status: 200 });
    }

    console.log("📨 [Email API] Inicializando Resend...");
    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log("📨 [Email API] Resend inicializado com sucesso!");

    let html = '';

    if (type === 'new_quote') {
      html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              line-height: 1.6; 
              color: #1F2937;
              background-color: #F9FAFB;
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .logo { 
              font-size: 36px; 
              font-weight: bold;
              margin-bottom: 10px;
            }
            .logo-inst { color: white; }
            .logo-auto { color: #FCD34D; }
            .content {
              padding: 40px 30px;
            }
            h2 {
              color: #1F2937;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #4B5563;
              margin-bottom: 16px;
            }
            .info-box {
              background: #F3F4F6;
              padding: 20px;
              border-radius: 12px;
              margin: 20px 0;
              border-left: 4px solid #3B82F6;
            }
            .info-box p {
              margin: 8px 0;
              color: #1F2937;
            }
            .btn { 
              display: inline-block; 
              background: linear-gradient(to right, #3B82F6, #2563EB);
              color: white !important; 
              padding: 16px 32px; 
              text-decoration: none; 
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }
            .footer { 
              background: #F9FAFB;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #E5E7EB;
            }
            .footer p {
              font-size: 13px;
              color: #6B7280;
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">
                <span class="logo-inst">Inst</span><span class="logo-auto">auto</span>
              </div>
              <p style="color: #DBEAFE; margin: 0;">Plataforma de Oficinas Mecânicas</p>
            </div>
            
            <div class="content">
              <h2>Novo orçamento recebido! 🎉</h2>
              
              <p>Olá <strong>${data.workshopName}</strong>,</p>
              
              <p>Você recebeu uma nova solicitação de orçamento:</p>
              
              <div class="info-box">
                <p><strong>👤 Cliente:</strong> ${data.motoristName}</p>
                <p><strong>🚗 Veículo:</strong> ${data.vehicleBrand} ${data.vehicleModel} ${data.vehicleYear}</p>
                <p><strong>🔧 Serviço:</strong> ${data.serviceType}</p>
                ${data.urgency ? `<p><strong>⚡ Urgência:</strong> ${data.urgency}</p>` : ''}
                <p><strong>📝 Descrição:</strong></p>
                <p style="background: white; padding: 10px; border-radius: 6px; color: #4B5563;">${data.description}</p>
              </div>
              
              <p style="text-align: center;">
                <a href="https://www.instauto.com.br/oficina/orcamentos" class="btn">
                  📋 Ver orçamento completo
                </a>
              </p>
              
              <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                💡 Responda rapidamente para aumentar suas chances de fechar o serviço!
              </p>
            </div>
            
            <div class="footer">
              <p><strong>© 2024 Instauto</strong></p>
              <p>Conectando motoristas e oficinas mecânicas.</p>
              <p style="margin-top: 15px;">
                <a href="https://www.instauto.com.br" style="color: #3B82F6; text-decoration: none;">www.instauto.com.br</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    if (type === 'quote_response') {
      html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              line-height: 1.6; 
              color: #1F2937;
              background-color: #F9FAFB;
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .logo { 
              font-size: 36px; 
              font-weight: bold;
              margin-bottom: 10px;
            }
            .logo-inst { color: white; }
            .logo-auto { color: #FCD34D; }
            .content {
              padding: 40px 30px;
            }
            h2 {
              color: #1F2937;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #4B5563;
              margin-bottom: 16px;
            }
            .info-box {
              background: #F3F4F6;
              padding: 20px;
              border-radius: 12px;
              margin: 20px 0;
              border-left: 4px solid #10B981;
            }
            .info-box p {
              margin: 8px 0;
              color: #1F2937;
            }
            .btn { 
              display: inline-block; 
              background: linear-gradient(to right, #3B82F6, #2563EB);
              color: white !important; 
              padding: 16px 32px; 
              text-decoration: none; 
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }
            .footer { 
              background: #F9FAFB;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #E5E7EB;
            }
            .footer p {
              font-size: 13px;
              color: #6B7280;
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">
                <span class="logo-inst">Inst</span><span class="logo-auto">auto</span>
              </div>
              <p style="color: #DBEAFE; margin: 0;">Plataforma de Oficinas Mecânicas</p>
            </div>
            
            <div class="content">
              <h2>Seu orçamento foi respondido! 🎉</h2>
              
              <p>Olá <strong>${data.motoristName}</strong>,</p>
              
              <p>A oficina <strong>${data.workshopName}</strong> respondeu seu orçamento:</p>
              
              <div class="info-box">
                <p><strong>🚗 Veículo:</strong> ${data.vehicleBrand} ${data.vehicleModel}</p>
                <p><strong>💰 Valor estimado:</strong> R$ ${data.estimatedPrice}</p>
                <p><strong>⏱️ Prazo:</strong> ${data.estimatedDays} dias</p>
                ${data.workshopResponse ? `<p><strong>💬 Mensagem da oficina:</strong></p><p style="background: white; padding: 10px; border-radius: 6px; color: #4B5563;">${data.workshopResponse}</p>` : ''}
              </div>
              
              <p style="text-align: center;">
                <a href="https://www.instauto.com.br/motorista/orcamentos" class="btn">
                  📋 Ver resposta completa
                </a>
              </p>
              
              <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                💡 Entre em contato com a oficina para agendar o serviço!
              </p>
            </div>
            
            <div class="footer">
              <p><strong>© 2024 Instauto</strong></p>
              <p>Conectando motoristas e oficinas mecânicas.</p>
              <p style="margin-top: 15px;">
                <a href="https://www.instauto.com.br" style="color: #3B82F6; text-decoration: none;">www.instauto.com.br</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    if (type === 'team_invite') {
      const inviter = data?.inviterName ? ` por ${data.inviterName}` : '';
      html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <meta name="color-scheme" content="light only">
        </head>
        <body style="margin:0;padding:0;background-color:#F3F4F6;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#F3F4F6">
            <tr><td align="center" style="padding:32px 16px;">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;">
                <tr><td align="center" bgcolor="#0B1120" style="background:#0B1120;padding:36px 20px;">
                  <span style="font-size:32px;font-weight:bold;">
                    <span style="color:#FFFFFF;">Inst</span><span style="color:#FCD34D;">auto</span>
                  </span>
                </td></tr>
                <tr><td style="padding:40px 32px;">
                  <h2 style="margin:0 0 16px 0;color:#111827;font-size:22px;">Você foi convidado para uma equipe 👥</h2>
                  <p style="color:#4B5563;font-size:16px;line-height:1.6;margin:0 0 16px;">
                    A oficina <strong style="color:#111827;">${data?.workshopName || 'no Instauto'}</strong> convidou você${inviter} para fazer parte da equipe dela no Instauto.
                  </p>
                  <p style="color:#4B5563;font-size:16px;line-height:1.6;margin:0 0 24px;">
                    Para entrar, acesse o Instauto com <strong>este mesmo e-mail</strong> (${to}). Se ainda não tem conta, crie uma — o vínculo com a oficina é feito automaticamente no primeiro acesso.
                  </p>
                  <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:8px auto 24px;">
                    <tr><td align="center" bgcolor="#FCD34D" style="background:#FCD34D;border-radius:12px;">
                      <a href="https://www.instauto.com.br/login" target="_blank" style="display:inline-block;padding:16px 36px;font-size:16px;font-weight:bold;color:#0B1120;text-decoration:none;border-radius:12px;">
                        Acessar o Instauto
                      </a>
                    </td></tr>
                  </table>
                  <p style="color:#6B7280;font-size:13px;line-height:1.6;margin:0;">Se você não esperava este convite, pode ignorar este e-mail.</p>
                </td></tr>
                <tr><td align="center" bgcolor="#F9FAFB" style="background:#F9FAFB;padding:24px;border-top:1px solid #E5E7EB;">
                  <p style="margin:0;color:#6B7280;font-size:13px;">© 2026 Instauto · <a href="https://www.instauto.com.br" style="color:#2563EB;text-decoration:none;">www.instauto.com.br</a></p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `;
    }

    console.log("📨 [Email API] Preparando envio via Resend...");
    console.log("📨 [Email API] From: Instauto <noreply@instauto.com.br>");
    console.log("📨 [Email API] To:", to);
    console.log("📨 [Email API] HTML length:", html.length, "chars");

    const { data: result, error } = await resend.emails.send({
      from: 'Instauto <noreply@instauto.com.br>',
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("📨 [Email API] Resposta do Resend recebida!");
    console.log("📨 [Email API] Erro?", !!error);
    console.log("📨 [Email API] Resultado?", !!result);

    if (error) {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error('❌ [Email API] ERRO AO ENVIAR EMAIL:');
      console.error('❌ [Email API] Erro completo:', JSON.stringify(error, null, 2));
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log('✅ [Email API] EMAIL ENVIADO COM SUCESSO!');
    console.log('✅ [Email API] ID do email:', result?.id);
    console.log('✅ [Email API] Resultado completo:', JSON.stringify(result, null, 2));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error('❌ [Email API] ERRO CRÍTICO:');
    console.error('❌ [Email API] Tipo:', error.name);
    console.error('❌ [Email API] Mensagem:', error.message);
    console.error('❌ [Email API] Stack:', error.stack);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return NextResponse.json({ success: false, error: 'Erro ao enviar email', details: error.message }, { status: 500 });
  }
}
