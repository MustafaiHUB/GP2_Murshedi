import { BASE_URL } from "./apiChatbot";

export async function userLogin(user) {
    // Send to the backend
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    console.log(response);
    if (!response.ok) {
        throw new Error("Failed to login!");
    }

    const data = await response.json();
    return data;
}

export async function userSignup(user) {
    // Send to the backend
    const response = await fetch(`${BASE_URL}/api/v1/registration`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error("Failed to register!");
    }

    const data = await response.json();
    return data;
}

export async function confirmEmail(email) {
    const response = await fetch(
        `${BASE_URL}/api/v1/registration/user/status?email=${email}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to check activation status:",
            response.statusText
        );
    }
    const data = await response.json();
    return data;
}