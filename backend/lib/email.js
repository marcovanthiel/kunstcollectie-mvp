import sgMail from '@sendgrid/mail';

// SendGrid API key configureren
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'SG.kunstcollectie_app_2025');

// E-mail voor wachtwoord reset
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const msg = {
    to: email,
    from: 'noreply@kunstcollectie.nl', // Vervang dit met een geverifieerd e-mailadres in SendGrid
    subject: 'Wachtwoord Reset - Kunstcollectie App',
    text: `U heeft een wachtwoord reset aangevraagd. Klik op de volgende link om uw wachtwoord te resetten: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f51b5;">Kunstcollectie App - Wachtwoord Reset</h2>
        <p>Beste gebruiker,</p>
        <p>U heeft een wachtwoord reset aangevraagd voor uw account bij de Kunstcollectie App.</p>
        <p>Klik op de onderstaande knop om uw wachtwoord te resetten:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3f51b5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Wachtwoord Resetten
          </a>
        </p>
        <p>Als u geen wachtwoord reset heeft aangevraagd, kunt u deze e-mail negeren.</p>
        <p>Deze link is 24 uur geldig.</p>
        <p>Met vriendelijke groet,<br>Het Kunstcollectie Team</p>
        <hr style="border: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">
          Dit is een automatisch gegenereerde e-mail. Gelieve niet te antwoorden op dit bericht.
        </p>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};

// E-mail voor nieuwe gebruiker
export const sendNewUserEmail = async (email, name, tempPassword) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;
  
  const msg = {
    to: email,
    from: 'noreply@kunstcollectie.nl', // Vervang dit met een geverifieerd e-mailadres in SendGrid
    subject: 'Welkom bij de Kunstcollectie App',
    text: `Welkom ${name}! Uw account is aangemaakt. Gebruik het volgende tijdelijke wachtwoord om in te loggen: ${tempPassword}. U kunt inloggen op: ${loginUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f51b5;">Welkom bij de Kunstcollectie App</h2>
        <p>Beste ${name},</p>
        <p>Uw account is succesvol aangemaakt. U kunt nu inloggen met de volgende gegevens:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Tijdelijk wachtwoord:</strong> ${tempPassword}</p>
        </div>
        <p>Om veiligheidsredenen raden wij u aan om uw wachtwoord te wijzigen na de eerste keer inloggen.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #3f51b5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Inloggen
          </a>
        </p>
        <p>Met vriendelijke groet,<br>Het Kunstcollectie Team</p>
        <hr style="border: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">
          Dit is een automatisch gegenereerde e-mail. Gelieve niet te antwoorden op dit bericht.
        </p>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};

// E-mail voor notificatie van wijzigingen
export const sendChangeNotificationEmail = async (email, name, entityType, entityName, action) => {
  const msg = {
    to: email,
    from: 'noreply@kunstcollectie.nl', // Vervang dit met een geverifieerd e-mailadres in SendGrid
    subject: `Kunstcollectie App - ${entityType} ${action}`,
    text: `Beste ${name}, er is een wijziging in de kunstcollectie: ${entityType} "${entityName}" is ${action}.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f51b5;">Kunstcollectie App - Notificatie</h2>
        <p>Beste ${name},</p>
        <p>Er is een wijziging in de kunstcollectie:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p>${entityType} <strong>"${entityName}"</strong> is ${action}.</p>
        </div>
        <p>U kunt inloggen op de applicatie om meer details te bekijken.</p>
        <p>Met vriendelijke groet,<br>Het Kunstcollectie Team</p>
        <hr style="border: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">
          Dit is een automatisch gegenereerde e-mail. Gelieve niet te antwoorden op dit bericht.
        </p>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log(`Notification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending notification email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};
