const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'

function getToken() {
    return localStorage.getItem('internlink_token')
}

async function request(endpoint, options = {}) {
    const token = getToken()

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!res.ok) {
        let errorMessage = `Request failed (${res.status})`
        try {
            const errorData = await res.json()
            if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail.map(err => err.msg || JSON.stringify(err)).join(', ')
            } else {
                errorMessage = errorData.detail || errorData.message || errorMessage
            }
        } catch (_) {
            // response wasn't JSON
        }
        throw new Error(errorMessage)
    }

    // Handle 204 No Content
    if (res.status === 204) return null

    return res.json()
}

const api = {
    get: (endpoint) =>
        request(endpoint, { method: 'GET' }),

    post: (endpoint, body) =>
        request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    put: (endpoint, body) =>
        request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),

    patch: (endpoint, body) =>
        request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        }),

    delete: (endpoint) =>
        request(endpoint, { method: 'DELETE' }),

    // For file uploads (e.g. resume) — no Content-Type header so browser sets multipart boundary
    upload: (endpoint, formData) => {
        const token = getToken()
        const headers = {}
        if (token) headers['Authorization'] = `Bearer ${token}`

        return fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData,
        }).then(async (res) => {
            if (!res.ok) {
                let errorMessage = `Upload failed (${res.status})`
                try {
                    const errorData = await res.json()
                    errorMessage = errorData.detail || errorData.message || errorMessage
                } catch (_) { }
                throw new Error(errorMessage)
            }
            return res.json()
        })
    },
}

export default api
