"use server";

export async function loggedIn(): Promise<boolean> {
    const response = await fetch("http://127.0.0.1:2778/welcome/logged_in", {
        method: "POST"
    });
    const json = await response.json();
    return json?.success === true;
}

export async function login(token: string): Promise<boolean> {
    const response = await fetch("http://127.0.0.1:2778/welcome/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token: token
        })
    });
    const json = await response.json();
    return json?.success === true;
}