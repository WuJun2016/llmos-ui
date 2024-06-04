<script setup lang="ts">
import { MANAGEMENT } from "@/config/schemas";
const managementStore = useManagementStore();
const users = await managementStore.findAll(MANAGEMENT.CLUSTER);

const columns = [
  { key: "metadata.state.name", label: "State", sortable: true },
  { key: "id", label: "User ID", sortable: true },
  { key: "username", label: "Username", sortable: true },
  { key: "displayName", label: "Dispaly Name", sortable: true },
  { key: "metadata.creationTimestamp", label: "Age", sortable: true },
  { key: "actions" },
];

const addOptions = [
  [
    {
      label: "Download YAML",
      click: () => {
        console.log("Download YAML");
      },
    },
    {
      label: "Delete",
      click: () => {
        remove("id");
      },
    },
  ],
];

async function remove(id: string) {
  await user.remove(id);
}

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return users;
  }

  return users.filter((user) => {
    return Object.values(user).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

const selected = ref([]);
</script>

<template>
  <div class="p-5">
    <h1
      class="font-semibold text-xl text-gray-900 dark:text-white leading-tight py-2"
    >
      Users
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

    <UTable :rows="filteredRows" :columns="columns" v-model="selected">
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
