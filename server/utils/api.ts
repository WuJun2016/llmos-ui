import OpenAI from 'openai'
// import type { Thread } from 'openai/resources/beta/threads'
// import type { ThreadMessage } from 'openai/resources/beta/threads/messages'
import { usleep } from '@/utils/promise'

export function useApi() {
  const cfg = useRuntimeConfig()

  if (!cfg.apiKey) {
    throw new Error('API Key not set')
  }

  const client = new OpenAI({
    // apiKey:       cfg.apiKey,
    baseURL:      cfg.api || 'https://api.openai.com/v1',
    // organization: cfg.organization,
  })


  return client
}

// export async function listMessages(threadId: string) {
//   const api = useApi()
//   const messages: ThreadMessage[] = []
//
//   console.debug('Listing messages for', threadId)
//   let res = await api.beta.threads.messages.list(threadId)
//
//   console.debug('Got', res.data.length, 'messages')
//
//   messages.push(...res.data)
//   while (res.hasNextPage() && res.body!.has_more) {
//     console.debug('Depaginating…')
//     res = await res.getNextPage()
//     console.debug('Got', res.data.length, 'messages')
//     messages.push(...res.data)
//   }
//
//   console.debug('Returning', messages.length, 'messages')
//
//   return messages
// }

// export function assistantFor(thread: Thread) {
//   const assistantId = ((thread.metadata || {}) as Record<string, string>).assistantId
//
//   return assistantId
// }

const finalized = ['cancelled', 'failed', 'completed', 'expired']

export async function waitForRun(threadId: string, assistantId: string) {
  const api = useApi()
  let run = await api.beta.threads.runs.create(threadId, { assistant_id: assistantId })

  while (!finalized.includes(run.status)) {
    await usleep(500)
    run = await api.beta.threads.runs.retrieve(threadId, run.id)
    console.debug(run.id, run.status)
  }

  return run
}

function resolve(from: string, to: string) {
  const res = new URL(to, new URL(from, 'resolve://'))

  if (res.protocol === 'resolve:') {
    const { pathname, search, hash } = res

    return pathname + search + hash
  }

  return res.toString()
}

export async function apiFetch(to: string, method = 'GET', body?: any) {
  const api = (useRuntimeConfig().api || '').replace(/\/+$/, '').replace(/^\/v1?/ig, '')
  // const api = useRuntimeConfig().api
  const url = resolve(api, to)
  const headers: Record<string, string> = { Accept: 'application/json' }

  if (body) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }

  const res = await fetch(url, { method, body, headers })
  const txt = await res.text()
  let out: any

  try {
    out = JSON.parse(txt)
  } catch (e) {
    console.error(e)
    out = { type: 'error', message: txt }
  }

  Object.defineProperty(out, '_status', { enumerable: false, configurable: true, value: res.status })

  return out
}

export async function apiList<T>(to: string) {
  let res = await apiFetch(to)

  setResponseStatus(res._status)

  const data: T[] = res.data

  while (res.object === 'list' && res.has_more) {
    res = await apiFetch(`${ to }?after=${ res.last_id }`)
    setResponseStatus(res._status)
    data.push(...res.data)
  }

  return data
}
