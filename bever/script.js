document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  fetch('https://bever-aca-assignment.azurewebsites.net/users')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const values = data.value;
      let hasUser = false;
      let userId = null;

      for (const user of values) {
        if (user.Name === username && user.Password === password) {
          hasUser = true;
          userId = user.UserId; 
          break;
        }
      }

      if (hasUser) {
        console.log('Login successful');
        localStorage.setItem('loggedInUserId', userId);
        window.location.href = "invoice.html";
      } else {
        console.log('User not found');
      }
    })
    .catch(error => {
      console.log(error);
    });
});
