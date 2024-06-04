<script setup lang="ts">
import { MANAGEMENT } from "@/config/schemas";

const managementStore = useManagementStore();

const settings = await managementStore.findAll(MANAGEMENT.SETTING);

const columns = [
  { key: "metadata.state.name", label: "State", sortable: true },
  { key: "id", label: "Name", sortable: true },
  { key: "value", label: "Value", sortable: true },
  { key: "actions" },
];

const q = ref("");
const selected = ref([]);

const filteredRows = computed(() => {
  if (!q.value) {
    return settings;
  }

  return settings.filter((setting) => {
    return Object.values(setting).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
</script>

<template>
  <div class="p-5">
    <h1
      class="font-semibold text-xl text-gray-900 dark:text-white leading-tight py-2"
    >
      Settings
      <div class="float-right">
        <UDropdown :items="addOptions" :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-heroicons-plus"
            aria-label="Add"
            size="sm"
            class="mr-4"
          >
            Create
          </UButton>
        </UDropdown>
      </div>
    </h1>
    <UDivider class="my-2" />

    <!-- Filters -->
    <div class="flex items-center gap-3 px-4 py-3">
      <UInput
        v-model="q"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Filter..."
        class="search row"
      />
    </div>

    <UTable :rows="filteredRows" v-model="selected" :columns="columns">
      <template #value-data="{ row }">
        <span v-if="row.value">
          {{ row.id }}
        </span>
        <span v-else>
          <span class="text-gray-400"></span>
        </span>
      </template>

      <template #metadata.state.name-data="{ row }">
        <UBadge
          :label="row.metadata.state.name"
          :color="
            row.metadata.state.error === false
              ? 'green'
              : row.metadata.state.transitioning === true
              ? 'orange'
              : 'red'
          "
          variant="subtle"
          class="capitalize"
          :tooltip="row.metadata.state.message"
        />
      </template>

      <template #metadata.creationTimestamp-data="{ row }">
        <span> {{ row.timeAgo() }} </span>
      </template>

      <template #actions-data="{ row }">
        <TableAction :data="row" />
      </template>
    </UTable>
  </div>
</template>

<style scoped></style>
