// Fonte única de contatos e redes sociais do Saúde Frugal.
//
// Para trocar QUALQUER número de WhatsApp ou URL de rede social, edite SÓ este
// arquivo — Header, Footer, páginas internas e os botões flutuantes leem daqui.

// WhatsApp: número internacional só com dígitos (DDI + DDD + número),
// sem espaços, "+" ou traços. Ex.: 55 47 99999-9999 -> "5547999999999".
// TODO: substituir pelo número real do consultório/equipe.
export const WHATSAPP_NUMBER = "5547999999999";

export const contact = {
  whatsappNumber: WHATSAPP_NUMBER,
  // TODO: confirmar e-mail de contato.
  email: "contato@saudefrugal.com.br",
};

// Monta um link wa.me, com mensagem opcional já pré-preenchida no chat.
export function whatsappUrl(message?: string): string {
  const url = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}

// Redes sociais. YouTube já confirmado (@saudefrugal); os demais são
// placeholders — confirmar os perfis reais antes do go-live.
export const social = {
  youtube: "https://www.youtube.com/@saudefrugal",
  instagram: "https://www.instagram.com/saudefrugal/", // TODO: confirmar handle
  facebook: "https://www.facebook.com/saudefrugal/", // TODO: confirmar handle
  spotify: "https://open.spotify.com/", // TODO: link real do perfil/podcast
};
