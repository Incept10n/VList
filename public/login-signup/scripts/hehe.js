let mode = changeTitle();
const form = createForm(mode);
sendRequestEvent(form);




function changeTitle() {
  let url = new URL(window.location.href);

  let mode = url.searchParams.get('action');

  document.title = mode == 'login' ? 'Log in' : 'Sign up';

  return mode;
}

function createForm(mode) {
  const heading = document.getElementById('heading-message');
  heading.innerHTML = mode == 'login' ? 'Log in' : 'Sign up';

  let form = document.createElement('form');

  form.setAttribute('action', `/auth/${mode}`);
  form.setAttribute('method', 'post');

  appendP(form, 'User name:');
  appendInput(form, 'text', 'username');

  if (mode == 'signup') {
    appendP(form, "Email:");
    appendInput(form, 'email', 'email');
  }

  appendP(form, "Password:");
  appendInput(form, 'password', 'password');

  let submitButton = document.createElement("input");
  submitButton.setAttribute("type", "submit");
  submitButton.setAttribute("value", "Submit");
  form.appendChild(submitButton);

  let infoDiv = document.querySelector('.info');
  infoDiv.appendChild(form);

  return form;

  function appendP(form, text) {
    const par = document.createElement('p');
    par.innerHTML = text;
    par.setAttribute('class', 'text');

    form.appendChild(par);
  }

  function appendInput(form, type, name) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('name', name);
    input.setAttribute('class', 'input');
    input.setAttribute('id', name)
    input.setAttribute('required', 'true');

    form.appendChild(input);
  }
}

function sendRequestEvent(form) {
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(form);

    const response = await fetch(`/auth/${mode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.get('username'),
        email: mode === 'signup' ? formData.get('email') : '',
        password: formData.get('password'),
      })
    });

    if (response.ok) {

      const respData = await response.json();

      document.cookie = `loginHash=${respData.hash}; path=/`;
      
      const errorPar = document.getElementById('errorPar');
      if (errorPar) {
        errorPar.remove();
      }

      const paragraph = document.createElement('p');
      paragraph.innerHTML = `${respData.message}`;
      paragraph.style.color = 'green';
      paragraph.style.textAlign = 'center';

      document.querySelector('.info').appendChild(paragraph);

      window.location.href = `/main-page?username=${formData.get('username')}`;
    } else {
      const errorData = await response.json();

      const errorPar = document.getElementById('errorPar');
      if (errorPar) {
        errorPar.remove();
      }

      const errorParagraph = document.createElement('p');
      errorParagraph.innerHTML = `${errorData.error}`;
      errorParagraph.style.color = 'red';
      errorParagraph.style.textAlign = 'center';
      errorParagraph.setAttribute('id', 'errorPar');

      document.querySelector('.info').appendChild(errorParagraph);
    }
  });
}
