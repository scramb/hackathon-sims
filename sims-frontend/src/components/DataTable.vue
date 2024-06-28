<template>
  <v-container>
    <v-data-table
      :items="items"
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
    </v-data-table>

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
export default {
  data() {
    return {
      bottomSheet: false,
      dialog: false,
      items: [
        { name: 'John Doe', email: 'john@example.com', phone: '555-555-5555' },
        { name: 'Jane Doe', email: 'jane@example.com', phone: '555-555-5556' },
        // Add more items as needed
      ],
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