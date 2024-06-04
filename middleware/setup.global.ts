import { useContext } from "@/stores/context";

/**
 * Middleware function for setting up global configuration.
 * @param {import('vue-router').Route} to - The target route object.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the setup was successful.
 */
export default defineNuxtRouteMiddleware(async (to /* , from */) => {
  const ctx = useContext();
  await ctx.loadManagement();

  return true;
});
