const emailReveal = document.querySelector('[data-email-reveal]');

if (emailReveal) {
  const encodedEmail = [
    [121, 110, 110, 111, 110],
    [122, 101, 108, 105, 104, 112, 105, 110, 97, 107, 97, 108, 104],
    [97, 122, 46, 111, 99],
  ];

  const decodePart = (codes) => String.fromCharCode(...codes.reverse());

  emailReveal.addEventListener(
    'click',
    () => {
      const address = `${decodePart(encodedEmail[0])}@${decodePart(encodedEmail[1])}.${decodePart(encodedEmail[2])}`;
      const emailLink = document.createElement('a');
      emailLink.className = 'email-link';
      emailLink.href = `mailto:${address}`;
      emailLink.textContent = address;
      emailLink.setAttribute('aria-label', `Email ${address}`);
      emailReveal.replaceWith(emailLink);
      window.location.href = emailLink.href;
    },
    { once: true },
  );
}
