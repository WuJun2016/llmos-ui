<script lang="ts" setup>
// import modelfiles from "~/server/routes/v1/modelfiles";
import type {ModelFile} from "~/types";

const mfs = useModelFiles()
// const modelFiles = await mfs.findAll()

const defaultColumns = [
  { key: 'metadata.state.name', label: 'State', sortable: true },
  { key: 'id', label: 'Name', sortable: true },
  { key: 'status.model', label: 'Model', sortable: true },
  { key: 'status.modelID', label: 'ID', sortable: true },
  { key: 'status.byteSize', label: 'Size' },
  { key: 'metadata.creationTimestamp', label: 'Age', sortable: true },
  { key: 'actions' },
]

const q = ref('')
const selected = ref<ModelFile[]>([])
const selectedColumns = ref(defaultColumns)
const selectedStatuses = ref([])
const selectedLocations = ref([])
const sort = ref({ column: 'id', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()
const isNewUserModalOpen = ref(false)


const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const query = computed(() => ({ q: q.value, sort: sort.value.column, order: sort.value.direction }))

const { data: modelfiles, pending } = await useFetch<ModelFile[]>('/v1/modelfiles', {
  query, default: () => []
})

function onSelect(row: ModelFile) {
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  }
})

async function remove(id: string) {
  await mfs.remove(id)
}
</script>

<template>
  <UDashboardPanel>
      <UDashboardNavbar
        title="ModelFiles"
        :badge="modelfiles.length"
      >
        <template #right>
          <UButton
            label="New Model File"
            trailing-icon="i-heroicons-plus"
            color="gray"
            @click="isNewUserModalOpen = true"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UButton
            v-model="selectedStatuses"
            icon="i-heroicons-arrow-down-tray"
            label="Download YAML"
          />
          <UButton
            v-model="selectedLocations"
            icon="i-heroicons-trash"
            label="Delete"
          />
        </template>

        <template #right>
          <UInput
            ref="input"
            v-model="q"
            icon="i-heroicons-funnel"
            autocomplete="off"
            placeholder="Filter..."
            class="hidden lg:block"
            @keydown.esc="$event.target.blur()"
          >
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>
        </template>
      </UDashboardToolbar>

      <UTable
        v-model="selected"
        v-model:sort="sort"
        :rows="modelfiles"
        :columns="columns"
        :loading="pending"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
        @select="onSelect">

        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar
              v-bind="row.avatar"
              :alt="row.name"
              size="xs"
            />

            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>

<!--        <template #state-data="{ row }">-->
<!--          <UBadge-->
<!--            :label="row.state"-->
<!--            :color="row.state === 'active' ? 'green' : row.state === 'bounced' ? 'orange' : 'red'"-->
<!--            variant="subtle"-->
<!--            class="capitalize"-->
<!--          />-->
<!--        </template>-->

        <template #actions-data="{ row }">
          <UButton icon="i-heroicons-trash" class="float-right" @click="remove(row.id)" />
        </template>

      </UTable>
  </UDashboardPanel>
</template>
