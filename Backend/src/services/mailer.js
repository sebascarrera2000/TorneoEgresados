import dotenv from "dotenv";
import FormData from "form-data";
import Mailgun from "mailgun.js";

dotenv.config();

/* =========================================================
   🔹 Inicialización Mailgun
========================================================= */
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key:
    process.env.MAILGUN_API_KEY ||
    "fc49fe4382ae402fbfa737a51890adfb-e80d8b76-b256f9a5",
  url: "https://api.mailgun.net",
});

const DOMAIN =
  process.env.MAILGUN_DOMAIN ||
  "sandbox8cfe38c3d1784e88927f33499ba77e08.mailgun.org";

/* =========================================================
   🔹 Selector de imagen hero por deporte
========================================================= */
const getHeroImage = (sportName = "") => {
  const s = sportName.toLowerCase();
  if (s.includes("fútbol") || s.includes("microfútbol"))
    return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80";
  if (s.includes("baloncesto") || s.includes("basket"))
    return "https://images.unsplash.com/photo-1603786794183-4f98f25b37a8?auto=format&fit=crop&w=900&q=80";
  if (s.includes("voleibol") || s.includes("voley"))
    return "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80";
  return "https://images.unsplash.com/photo-1591115765373-5207764f74d6?auto=format&fit=crop&w=900&q=80";
};

/* =========================================================
   🔹 Plantilla base
========================================================= */
const baseTemplate = (title, content, heroUrl) => `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title}</title>
<style>
  body {
    font-family: 'Poppins', Arial, sans-serif;
    background: #eaf1fb;
    margin: 0;
    padding: 0;
    color: #1e293b;
  }
  .container {
    max-width: 720px;
    margin: 30px auto;
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    overflow: hidden;
  }
  .header img { width: 100%; height: 200px; object-fit: cover; }
  .header-title {
    text-align: center;
    background: linear-gradient(90deg, #004AAD, #0074E4);
    color: white;
    padding: 18px;
    font-size: 1.8rem;
    font-weight: 800;
    text-transform: uppercase;
  }
  .body { padding: 36px 32px; }
  .body h2 { color: #004AAD; text-align: center; font-weight: 700; }
  .highlight { color: #0074E4; font-weight: 700; }
  .card {
    background: #f1f5f9;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    border-left: 4px solid #0074E4;
  }
  .card p { margin: 0.4rem 0; display: flex; align-items: center; }
  .card img.icon { width: 26px; height: 26px; margin-right: 10px; }
  .btn {
    display: inline-block;
    background: #004AAD;
    color: #fff;
    padding: 12px 24px;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
  }
  .btn:hover { background: #0074E4; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${heroUrl}" />
    </div>
    <div class="header-title">Egresado Leyendas ⚡</div>
    <div class="body">${content}</div>

    <div class="footer" style="background:#004AAD;color:#fff;text-align:center;padding:25px 20px;">
      <img src="https://www.umariana.edu.co/images2022/portada/Logo-Universidad-Mariana.png"
           style="width:120px;margin:0 auto 10px;display:block;">
      © ${new Date().getFullYear()} Universidad Mariana · Liga de Egresados
    </div>
  </div>
</body>
</html>
`;

/* =========================================================
   🔹 Plantilla: Registro de Equipo
========================================================= */
export const teamRegisteredTemplate = (team, sport) =>
  baseTemplate(
    "Registro de Equipo Exitoso",
    `
  <h2>¡Tu equipo ha sido registrado con éxito!</h2>
  <p>Hola <span class="highlight">${team.captainName}</span>, tu equipo <b>${team.teamName}</b> ha quedado inscrito en <b>${sport.name}</b>.</p>

  <div class="card">
    <p><img class="icon" src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"> <b>Capitán:</b> ${team.captainName}</p>
    <p><img class="icon" src="https://cdn-icons-png.flaticon.com/512/681/681494.png"> <b>Cédula:</b> ${team.captainId}</p>
    <p><img class="icon" src="https://cdn-icons-png.flaticon.com/512/724/724664.png"> <b>Teléfono:</b> ${team.phone}</p>
    <p><img class="icon" src="https://cdn-icons-png.flaticon.com/512/646/646094.png"> <b>Correo:</b> ${team.email}</p>
  </div>

  <h3 style="color:#004AAD;">Jugadores:</h3>
  <div class="card">
    ${
      team.players?.length
        ? team.players
            .map(
              (p) =>
                `<p>
                  <img class="icon" src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png">
                  ${p.name} — <i>${p.program || "Programa no especificado"}</i>
                </p>`
            )
            .join("")
        : "<p>No hay jugadores adicionales registrados.</p>"
    }
  </div>

  <div style="text-align:center;">
    <a class="btn" href="#">Ver reglamento del torneo</a>
  </div>
  `,
    getHeroImage(sport.name)
  );

/* =========================================================
   🔹 Plantilla: Nuevo jugador
========================================================= */
export const newPlayerTemplate = (team, player, sport) =>
  baseTemplate(
    "Nuevo Jugador Registrado",
    `
  <h2>¡Nuevo integrante confirmado!</h2>
  <p>El jugador <span class="highlight">${player.name}</span> (${player.program}) se ha unido al equipo <b>${team.teamName}</b> en <b>${sport.name}</b>.</p>

  <div class="card">
    <p><img class="icon" src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"> <b>Nombre:</b> ${player.name}</p>
    <p><img class="icon" src="https://cdn-icons-png.flaticon.com/512/471/471664.png"> <b>Cédula:</b> ${player.idNumber}</p>
    <p><img class="icon" src="https://cdn-icons-png.flaticon.com/512/201/201818.png"> <b>Programa:</b> ${player.program}</p>
    ${
      player.email
        ? `<p><img class="icon" src="https://cdn-icons-png.flaticon.com/512/646/646094.png"> <b>Correo:</b> ${player.email}</p>`
        : ""
    }
  </div>

  <p>El equipo ahora tiene <b>${team.players.length}</b> jugadores registrados.</p>

  <div style="text-align:center;">
    <a class="btn" href="#">Ver listado completo</a>
  </div>
  `,
    getHeroImage(sport.name)
  );

/* =========================================================
   🔹 FUNCIÓN FINAL PARA ENVIAR CORREOS
========================================================= */
export const sendMail = async (to, subject, html) => {
  const fromName = process.env.MAIL_FROM_NAME || "Egresado Leyendas ⚡";

  const fromAddr =
    process.env.MAIL_FROM_ADDR ||
    "postmaster@sandbox8cfe38c3d1784e88927f33499ba77e08.mailgun.org";

  try {
    const res = await mg.messages.create(DOMAIN, {
      from: `${fromName} <${fromAddr}>`,
      to,
      subject,
      html,
    });

    console.log("📨 Correo enviado:", res.id);
    return res;
  } catch (err) {
    console.error("❌ Error enviando correo:", err.message);
    throw err;
  }
};
