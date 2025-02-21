import { getAllUserNotesFromDatabase } from "./main.js";

clearFormOnClick();
deleteFormOnClick();
editAndSaveOnClick();

export function notesActionsMain() {
  const notes = document.querySelectorAll('.note-from-database');

  for (const note of notes) {
    note.addEventListener('click', function() {
      const note = this;
      const heading = note.querySelector('#heading').innerHTML;
      const contents = note.querySelector('#content').innerHTML;

      const form = document.querySelector('.body .new-note form');
      form.setAttribute('id', note.getAttribute('id'));
      const formHeading = form.querySelector('input[type=text]');
      const formContent = form.querySelector('textarea');
      formHeading.value = heading;
      formContent.value = contents;

      if (document.querySelector('.hide')) {
        const sideButtonsContainer = document.querySelector('.hide');
        sideButtonsContainer.setAttribute('class', 'two-side-buttons-container');
      }
    });
  }
}

function clearFormOnClick() {
  const clearBtn = document.getElementById('clear');
  clearBtn.addEventListener('click', () => {
    const form = document.querySelector('.new-note form');

    if (document.querySelector('.two-side-buttons-container')) {
      const sideButtonsContainer = document.querySelector('.two-side-buttons-container');
      sideButtonsContainer.setAttribute('class', 'hide');
    }

    form.reset();
    form.removeAttribute('id');
  });
}

function deleteFormOnClick() {
  const deleteBtn = document.getElementById('deleteBtn');
  deleteBtn.addEventListener('click', async function() {
    const form = document.querySelector('.new-note form');

    if (!form.getAttribute('id')) { return; }

    const response = await fetch(`/main-page/deleteNote/${form.getAttribute('id')}`);

    if (document.querySelector('.two-side-buttons-container')) {
      const sideButtonsContainer = document.querySelector('.two-side-buttons-container');
      sideButtonsContainer.setAttribute('class', 'hide');
    }

    if (response.ok) {
      form.reset();
      await getAllUserNotesFromDatabase();
    }
  });
}

function editAndSaveOnClick() {
  const editAndSaveBtn = document.getElementById('edit-and-saveBtn');

  editAndSaveBtn.addEventListener('click', async function () {
    const form = document.querySelector('.new-note form');

    if (!form.getAttribute('id')) { return; }
    const formData = new FormData(form);

    const response = await fetch ('/main-page/updateNote', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `${form.getAttribute('id')}`,
        header: `${formData.get('new-note-heading')}`,
        contains: `${formData.get('new-note-text')}`,
      }),
    });

    if (document.querySelector('.two-side-buttons-container')) {
      const sideButtonsContainer = document.querySelector('.two-side-buttons-container');
      sideButtonsContainer.setAttribute('class', 'hide');
    }

    if (response.ok) {
      form.reset();
      await getAllUserNotesFromDatabase();
    }
  });
}
