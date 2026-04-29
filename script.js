document.querySelector('.contact-form')?.addEventListener('submit', function (event) {
  event.preventDefault();
  alert('Thanks for reaching out! We will follow up soon with your digital notes details.');
  event.target.reset();
});
