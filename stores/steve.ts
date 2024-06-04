import { defineStore } from "pinia";

import {
  SteveTypeActions,
  SteveTypeGetters,
  SteveTypeState,
} from "@/composables/steve/type";
import type { IResource } from "@/composables/steve/types";

/**
 * /v1/${type}
 */
export const useManagementStore = defineStore("management", {
  state: SteveTypeState<DecoratedResource>({
    baseUrl: "/v1",
  }),
  getters: SteveTypeGetters<DecoratedResource>(),
  actions: SteveTypeActions<IResource, DecoratedResource>(),
});
