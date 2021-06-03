interface RequestInit2 extends RequestInit {
  data: any
}

export function request(input: RequestInfo, init?: RequestInit2) {
  return fetch(input, {
    ...init,
    method: init?.method ?? 'post',
    body: JSON.stringify(init?.data),
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  }).then(async (r) => {
    const text = await r.text()
    if (r.ok) {
      return text
    }
    return Promise.reject(text)
  })
}
