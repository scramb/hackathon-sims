<template>
  <v-container>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
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
                <v-textarea v-model="inputData" label="Your E-Mail content"></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-btn color="green" @click="sendData">
                  Confirm
                </v-btn>
                <v-btn color="red" @click="close">
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
        <v-card-title>{{ selectedRow.plant }} - {{ selectedRow.update }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="selectedRow.reason"
            :counter="10"
            label="Reason"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="selectedRow.period"
            :counter="10"
            label="Period"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="selectedRow.remark"
            :counter="10"
            label="Remark"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="selectedRow.Restriction"
            :counter="10"
            label="Restriction"
            hide-details
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeBottomSheet">Close</v-btn>
          <v-btn disabled color="green" @click="updateRow">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>

<script>

  const FakeAPI = () => new Promise(resolve => {
        fetch('http://localhost:8080')
          .then(response => response.json())
          .then(data => {resolve([data, data.length])});
      })

  const SendData = (data) => new Promise((resolve, reject) => {
    const body = JSON.stringify({ instance: data })
    console.log(body)
    fetch('http://localhost:8080', {
      body,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => resolve())
  })

export default {
  data() {
    return {
      search: '',
      serverItems: [],
      headers: [{
        title: 'Plant',
        key: 'plant'
      }, {
        title: 'Update',
        key: 'update'
      }, {
        title: 'Reason',
        key: 'reason'
      }, {
        title: 'Period',
        key: 'period'
      }, {
        title: 'Remark',
        key: 'remark'
      }, {
        title: 'Restriction',
        key: 'Restriction'
      }],
      inputData: '',
      loading: true,
      totalItems: 0,
      bottomSheet: false,
      dialog: false,
      editedIndex: -1,
      editedItem: {
        plant: '',
        update: '',
        reason: '',
        period: '',
        remark: '',
        Restriction: '',
      },
      defaultItem: {
        plant: '',
        update: '',
        reason: '',
        period: '',
        remark: '',
        Restriction: '',
      },
    };
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  methods: {
    sendData () {
      console.log('data send', this.inputData)
      SendData(this.inputData)
      this.inputData = ''
      this.close()
      this.loadItems({ page: 1, itemsPerPage: 10})
    },
    loadItems ({ page, itemsPerPage, sortBy }) {
      this.loading = true
      FakeAPI().then(([items, total]) => {
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
    forceReload() {
      this.loadItems();
    }
  },
  watch: {
      dialog (val) {
        val || this.close()
      },
    },
};
</script>