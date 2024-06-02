import { defineStore } from 'pinia'
import { mgmtStores, useMgmt } from '@/stores/steve'
import type { ICollection } from '@/composables/steve/types'

/**
 * Represents the context store.
 */
export const useContext = defineStore('context', {
  state: () => {
    return {
      mgmtSetup: false,
    }
  },

  getters: {
    baseUrl: () => {
      let base = ''

      console.log("process.server", process.server)
      if ( process.server ) {
        const headers = useRequestHeaders()

        base = `http://${ headers.host }`
      }

      base += '/v1'
      console.log("base url", base)
      return base
    },

    managerDomain: () => {
      const config = useRuntimeConfig()
      let domain = ''

      if ( typeof window !== 'undefined') {
        domain = window?.location?.origin
      }

      if ( domain.includes('localhost') || domain.includes('127.0.0') || domain.includes('0.0.0.0') ) {
        domain = config.public.api
      }

      domain = domain.replace(/^https?:\/\//, '')

      return domain
    },
  },

  actions: {
    async setupMgmt() {
      if ( this.mgmtSetup ) {
        return
      }

      this.mgmtSetup = true

      const mgmt = useMgmt()

      console.log("setup mgmt url", this.baseUrl)
      mgmt.configure(this.baseUrl)
      mgmt.subscribe()

      console.log("setup mgmt", mgmt)
      await mgmt.loadSchemas()

      const p: Promise<ICollection<any>>[] = []

      for ( const k in mgmtStores ) {
        const s = mgmtStores[k]()
        s.configure(mgmt)
        p.push(s.findAll())
      }

      await Promise.all(p)
    },
  }
})