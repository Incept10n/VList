import { notesActionsMain } from "./displayAndEditNode.js";

checkIdentity();
setName();
getAllUserNotesFromDatabase();
sendFormOnSubmit();
signOut();

function setName() {
  const querries = new URL(window.location.href).searchParams;
  const querryName = querries.get('username');

  const nameToDiplay = document.getElementById('user-name');
  nameToDiplay.innerHTML = querryName;
}

async function sendFormOnSubmit() {
  const form = document.querySelector('form');
  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const params = (new URL(window.location.href)).searchParams;

    const formData = new FormData(form);

    const response = await fetch(`write/${params.get('username')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `${params.get('username')}`,
        header: `${formData.get('new-note-heading')}`,
        contains: `${formData.get('new-note-text')}`,
      }),
    });

    formData.delete

    // we run it here to update the ui
    getAllUserNotesFromDatabase();

    form.reset();
    const checkForResponseParagraph = document.getElementById('response-paragraph');

    if (checkForResponseParagraph) {
      checkForResponseParagraph.remove();
    }

    if (response.ok) {
      insertStateMessage('green');
    } else {
      insertStateMessage('red');
    }

    async function insertStateMessage(color) {
      const stateParagraph = document.createElement('p');
      stateParagraph.innerHTML = (await response.json()).message;
      stateParagraph.style.color = color;
      stateParagraph.style.position = 'absolute';
      stateParagraph.style.top = '0px';
      stateParagraph.setAttribute('id', 'response-paragraph');

      const insertBefore = document.querySelector('.new-note .text');
      const parentElement = document.querySelector('form[method=POST]');

      parentElement.insertBefore(stateParagraph, insertBefore);

      setTimeout(() => {
        console.log('here');
        document.getElementById('response-paragraph').remove();
      }, 1500);
    }
  });
}

export async function getAllUserNotesFromDatabase() {
  const urlQuery = (new URL(window.location.href)).searchParams;
  const response = await fetch(`/main-page/getAllNotes/${urlQuery.get('username')}`); 

  const allUserNotesArray = await response.json();

  // deleting all the children before inserting the same onces
  const toDeleteAllNotesFrom = document.querySelector('.user-notes');
  while (toDeleteAllNotesFrom.firstChild) {
    toDeleteAllNotesFrom.removeChild(toDeleteAllNotesFrom.firstChild);
  }

  if (allUserNotesArray.notes.length === 0) {
    const noNotesParagraph = document.createElement('p');
    noNotesParagraph.innerHTML = `You have no notes. Go create one!`;
    noNotesParagraph.setAttribute('class', 'state-paragraph');

    document.querySelector('.user-notes').appendChild(noNotesParagraph);
  }

  for (const note of allUserNotesArray.notes) {
    createAndAppendNewNote(note.heading, note.content, note.id);
  }

  // after we loaded all of the elements we can add actions to them
  notesActionsMain();

  function createAndAppendNewNote(heading, content, id) {
    const containerDiv = document.createElement('div');
    containerDiv.setAttribute('class', 'note-from-database');
    containerDiv.setAttribute('id', id);

    const h5 = document.createElement('h5');
    h5.setAttribute('id', 'heading');
    h5.innerHTML = heading;

    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('id', 'content');
    contentDiv.innerHTML = content;

    containerDiv.appendChild(h5);
    containerDiv.appendChild(contentDiv);

    const allUserNotesDiv = document.querySelector('.user-notes');
    allUserNotesDiv.appendChild(containerDiv);
  }
}

async function checkIdentity() {
  const querries = new URL(window.location.href).searchParams;
  const querryName = querries.get('username');

  const result = await fetch('/main-page/validateIdentity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: querryName,
      hash: `${getCookieValue('loginHash')}`,
    }),
  });

  if (!result.ok) {
    window.location.href = '/welcome';
  }
}

function signOut() {
  const signOutBtn = document.querySelector('.sign-out-btn');
  signOutBtn.addEventListener('click', () => {
    document.cookie = 'loginHash=; path=/';
    window.location.href = '/';
  });
}

function getCookieValue(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return "";
}
