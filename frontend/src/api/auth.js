const BASE_URL = "http://127.0.0.1:5000/users";

export async function loginUser(credentials) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });

    if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid email or password');
    } 

    return response.json(); // Expect token and user info from backend
}
