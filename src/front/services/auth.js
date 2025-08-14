const host = import.meta.env.VITE_BACKEND_URL

export const login = async dataToSend => {
  const endpoint = `${host}/api/login`
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend)
  }
  const response = await fetch(endpoint, options)
  let data = null
  try {
    data = await response.json()
  } catch {}

  if (!response.ok) {
    const message = data?.message || `Error ${response.status} ${response.statusText}`
    throw new Error(message)
  }
  return data
}

export const register = async dataToSend => {
  const endpoint = `${host}/api/users`
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend)
  })
  let data = null
  try {
    data = await response.json()
  } catch {}

  if (!response.ok) {
    const message = data?.message || `Error ${response.status} ${response.statusText}`
    throw new Error(message)
  }
  return data
}
