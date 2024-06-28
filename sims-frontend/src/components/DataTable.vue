<template>
  <v-container>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="name"
      @update:options="loadItems"
      @click:row="openBottomSheet"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                class="mb-2"
                color="primary"
                dark
                v-bind="props"
              >
                Add new Entry
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-textarea label="Your E-Mail content"></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-btn color="green">
                  Confirm
                </v-btn>
                <v-btn color="red">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
    </v-data-table-server>

    <v-bottom-sheet v-model="bottomSheet">
      <v-card>
        <v-card-title>{{ selectedRow.name }}</v-card-title>
        <v-card-text>
          <p><strong>Email:</strong> {{ selectedRow.email }}</p>
          <p><strong>Phone:</strong> {{ selectedRow.phone }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeBottomSheet">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>

<script>

  const desserts = [
    {
      name: 'Frozen Yogurt',
      calories: 159,
      fat: 6.0,
      carbs: 24,
      protein: 4.0,
      iron: '1',
    },
    {
      name: 'Jelly bean',
      calories: 375,
      fat: 0.0,
      carbs: 94,
      protein: 0.0,
      iron: '0',
    },
    {
      name: 'KitKat',
      calories: 518,
      fat: 26.0,
      carbs: 65,
      protein: 7,
      iron: '6',
    },
    {
      name: 'Eclair',
      calories: 262,
      fat: 16.0,
      carbs: 23,
      protein: 6.0,
      iron: '7',
    },
    {
      name: 'Gingerbread',
      calories: 356,
      fat: 16.0,
      carbs: 49,
      protein: 3.9,
      iron: '16',
    },
    {
      name: 'Ice cream sandwich',
      calories: 237,
      fat: 9.0,
      carbs: 37,
      protein: 4.3,
      iron: '1',
    },
    {
      name: 'Lollipop',
      calories: 392,
      fat: 0.2,
      carbs: 98,
      protein: 0,
      iron: '2',
    },
    {
      name: 'Cupcake',
      calories: 305,
      fat: 3.7,
      carbs: 67,
      protein: 4.3,
      iron: '8',
    },
    {
      name: 'Honeycomb',
      calories: 408,
      fat: 3.2,
      carbs: 87,
      protein: 6.5,
      iron: '45',
    },
    {
      name: 'Donut',
      calories: 452,
      fat: 25.0,
      carbs: 51,
      protein: 4.9,
      iron: '22',
    },
  ]

  const FakeAPI = {
    async fetch ({ page, itemsPerPage, sortBy }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = desserts.slice()

          if (sortBy.length) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order
            items.sort((a, b) => {
              const aValue = a[sortKey]
              const bValue = b[sortKey]
              return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
            })
          }

          const paginated = items.slice(start, end)

          resolve({ items: paginated, total: items.length })
        }, 500)
      })
    },
  }



export default {
  data() {
    return {
      search: '',
      serverItems: [],
      loading: true,
      totalItems: 0,
      bottomSheet: false,
      dialog: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    };
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  methods: {
    loadItems ({ page, itemsPerPage, sortBy }) {
      this.loading = true
      FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
        this.serverItems = items
        this.totalItems = total
        this.loading = false
      })
    },
    openBottomSheet(event, { item }) {
      console.log(item)
      this.selectedRow = item;
      this.bottomSheet = true;
    },
    closeBottomSheet() {
      this.bottomSheet = false;
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
  watch: {
      dialog (val) {
        val || this.close()
      },
    },
};
</script>