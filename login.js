// Function to handle the login process
async function handleLogin(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get form inputs
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Perform validation
    if (username === '' || password === '') {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('https://moneywise.eswe.dev/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const accessToken = data.accessToken;

        // Redirect to dashboard page
        window.location.href = 'dashboard.html';
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  }
  
  // Attach the function to the form's submit event
  const loginForm = document.querySelector('.login-form');
  loginForm.addEventListener('submit', handleLogin);
  