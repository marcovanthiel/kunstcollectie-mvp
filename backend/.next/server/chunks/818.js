"use strict";exports.id=818,exports.ids=[818],exports.modules={7818:(e,t,o)=>{o.d(t,{LS:()=>sendPasswordResetEmail,tH:()=>sendNewUserEmail,zJ:()=>sendChangeNotificationEmail});var n=o(2139),r=o.n(n);r().setApiKey(process.env.SENDGRID_API_KEY||"SG.kunstcollectie_app_2025");let sendPasswordResetEmail=async(e,t)=>{let o=`${process.env.FRONTEND_URL}/reset-password?token=${t}`,n={to:e,from:"noreply@kunstcollectie.nl",subject:"Wachtwoord Reset - Kunstcollectie App",text:`U heeft een wachtwoord reset aangevraagd. Klik op de volgende link om uw wachtwoord te resetten: ${o}`,html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f51b5;">Kunstcollectie App - Wachtwoord Reset</h2>
        <p>Beste gebruiker,</p>
        <p>U heeft een wachtwoord reset aangevraagd voor uw account bij de Kunstcollectie App.</p>
        <p>Klik op de onderstaande knop om uw wachtwoord te resetten:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${o}" style="background-color: #3f51b5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
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
    `};try{return await r().send(n),console.log(`Password reset email sent to ${e}`),!0}catch(e){return console.error("Error sending password reset email:",e),e.response&&console.error(e.response.body),!1}},sendNewUserEmail=async(e,t,o)=>{let n=`${process.env.FRONTEND_URL}/login`,i={to:e,from:"noreply@kunstcollectie.nl",subject:"Welkom bij de Kunstcollectie App",text:`Welkom ${t}! Uw account is aangemaakt. Gebruik het volgende tijdelijke wachtwoord om in te loggen: ${o}. U kunt inloggen op: ${n}`,html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f51b5;">Welkom bij de Kunstcollectie App</h2>
        <p>Beste ${t},</p>
        <p>Uw account is succesvol aangemaakt. U kunt nu inloggen met de volgende gegevens:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>E-mail:</strong> ${e}</p>
          <p><strong>Tijdelijk wachtwoord:</strong> ${o}</p>
        </div>
        <p>Om veiligheidsredenen raden wij u aan om uw wachtwoord te wijzigen na de eerste keer inloggen.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${n}" style="background-color: #3f51b5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Inloggen
          </a>
        </p>
        <p>Met vriendelijke groet,<br>Het Kunstcollectie Team</p>
        <hr style="border: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">
          Dit is een automatisch gegenereerde e-mail. Gelieve niet te antwoorden op dit bericht.
        </p>
      </div>
    `};try{return await r().send(i),console.log(`Welcome email sent to ${e}`),!0}catch(e){return console.error("Error sending welcome email:",e),e.response&&console.error(e.response.body),!1}},sendChangeNotificationEmail=async(e,t,o,n,i)=>{let s={to:e,from:"noreply@kunstcollectie.nl",subject:`Kunstcollectie App - ${o} ${i}`,text:`Beste ${t}, er is een wijziging in de kunstcollectie: ${o} "${n}" is ${i}.`,html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f51b5;">Kunstcollectie App - Notificatie</h2>
        <p>Beste ${t},</p>
        <p>Er is een wijziging in de kunstcollectie:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p>${o} <strong>"${n}"</strong> is ${i}.</p>
        </div>
        <p>U kunt inloggen op de applicatie om meer details te bekijken.</p>
        <p>Met vriendelijke groet,<br>Het Kunstcollectie Team</p>
        <hr style="border: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">
          Dit is een automatisch gegenereerde e-mail. Gelieve niet te antwoorden op dit bericht.
        </p>
      </div>
    `};try{return await r().send(s),console.log(`Notification email sent to ${e}`),!0}catch(e){return console.error("Error sending notification email:",e),e.response&&console.error(e.response.body),!1}}}};