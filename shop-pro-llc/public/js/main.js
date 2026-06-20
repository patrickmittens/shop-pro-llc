document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      var submitBtn = form.querySelector('button[type="submit"]');
      var payload = {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        category: form.category.value,
        message: form.message.value.trim(),
        website: form.website.value
      };

      status.textContent = '';
      status.className = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().then(function (data) { return { ok: res.ok, data: data }; });
        })
        .then(function (result) {
          if (result.ok && result.data.success) {
            status.textContent = "Message sent. We'll be in touch soon.";
            status.className = 'success';
            form.reset();
          } else {
            status.textContent = (result.data && result.data.error) || 'Something went wrong. Please try again.';
            status.className = 'error';
          }
        })
        .catch(function () {
          status.textContent = 'Network error. Please try again in a moment.';
          status.className = 'error';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message';
        });
    });
  }
});
