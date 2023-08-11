document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.login-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch('http://moneywise.eswe.dev/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                window.location.href = 'index.html'; // Redirect to login page
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    });
});
