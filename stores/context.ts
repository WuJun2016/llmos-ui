import { defineStore } from "pinia";
import { useManagementStore } from "@/stores/steve";
import type { ICollection } from "@/composables/steve/types";

export const useContext = defineStore("context", {
  state: () => {
    return {
      managementReady: false,
      clusterReady: false,
      isMultiCluster: false,
      isRancher: false,
      namespaceFilters: [],
      allNamespaces: null,
      allWorkspaces: null,
      clusterId: null,
      productId: null,
      workspace: null,
      error: null,
      cameFromError: false,
      pageActions: [],
      serverVersion: null,
      systemNamespaces: [],
    };
  },

  actions: {
    async loadManagement() {
      if (this.managementReady) {
        return;
      }

      this.managementReady = true;

      const managementStore = useManagementStore();
      await managementStore.loadSchemas();
    },
  },
});
