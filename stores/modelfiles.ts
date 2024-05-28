import { defineStore } from 'pinia'
import type { ModelFile } from "~/types"

export const useModelFiles = defineStore('modelfiles', {
  state: () => {
    return {
      list:    [] as ModelFile[],
      haveAll: false,
    }
  },

  getters: {},

  actions: {
    byId(id: string) {
      return (this.list as ModelFile[]).find((x) => x.id === id)
    },

    async find(id: string) {
      await this.findAll()
      const existing = this.byId(id)

      if (existing) {
        return existing
      }
    },

    async findAll(force = false) {
      if (!this.haveAll || force) {
        const data = (await $fetch(`/v1/modelfiles`)).map((x: any) => reactive(x)) as ModelFile[]
        replaceWith(this.list, ...data)
      }

      this.haveAll = true

      return this.list as ModelFile[]
    },

    // async create(body: ModelFile) {
    //   const res = await $fetch('/v1/modelfiles', {
    //     method: 'POST',
    //     body:   JSON.stringify(body),
    //   })
    //
    //   this.list.push(res)
    // },

    async remove(id: string) {
      await $fetch(`/v1/modelfiles/${ encodeURIComponent(id) }`, { method: 'DELETE' })

      const existing = this.byId(id)

      if (existing) {
        removeObject(this.list, existing)
      }
    },
  },
})
