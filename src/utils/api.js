const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, options) {
 console.log("API URL:", `${API_BASE}${path}`);

const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed (${res.status})`)
  }
  if (res.status === 204) return null
  return res.json()
}

export function saveProject(payload) {
  return request('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function listProjects() {
  return request('/api/projects')
}

export function getProject(id) {
  return request(`/api/projects/${id}`)
}

export function deleteProject(id) {
  return request(`/api/projects/${id}`, { method: 'DELETE' })
}
