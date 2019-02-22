<template>
  <b-container fluid>
    <b-table
      show-empty
      stacked="md"
      :items="companies"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      @head-clicked="editingStatusReset"
    >
      <template slot="inn" slot-scope="row">
        <table-item
          :row="row"
          :state="innState"
          :errorText="'ИНН должен быть уникальным и состоять из десяти цифр'"
          :mask="'##########'"
          v-model="input.inn"
          @data-change="saveData"
        />
      </template>

      <template slot="companyName" slot-scope="row">
        <table-item
          :row="row"
          :state="companyNameState"
          :errorText="'Наименование компании должно быть непустой строкой'"
          v-model="input.companyName"
          @data-change="saveData"
        />
      </template>

      <template slot="ownerName" slot-scope="row">
        <table-item
          :row="row"
          :state="ownerNameState"
          :errorText="'ФИО руководителя должно быть непустой строкой'"
          v-model="input.ownerName"
          @data-change="saveData"
        />
      </template>

      <template slot="actions" slot-scope="row">
        <b-button
          id="editButton"
          size="sm"
          class="mr-1"
          :disabled="error || editing && !row.item.editing"
          @click="row.item.editing ? onSave() : onEditing(row.item)"
        >{{ row.item.editing ? 'Сохранить' : 'Изменить' }}</b-button>
        <b-button
          id="deleteButton"
          size="sm"
          class="mr-1"
          variant="danger"
          @click="onDelete(row.item.id)"
        >Удалить</b-button>
      </template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination
          class="my-0"
          :total-rows="totalRows"
          :per-page="perPage"
          v-model="currentPage"
          @change="editingStatusReset"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import TableItem from './TableItem.vue'

export default {
  props: {
    companies: {
      type: Array,
      default: () => {}
    }
  },
  data: () => {
    return {
      fields: [
        {
          key: 'inn',
          label: 'ИНН',
          sortable: true
        },
        {
          key: 'companyName',
          label: 'Наименование компании',
          sortable: true
        },
        {
          key: 'ownerName',
          label: 'ФИО руководителя',
          sortable: true
        },
        { key: 'actions', label: '' }
      ],
      input: {
        inn: '',
        companyName: '',
        ownerName: '',
        id: ''
      },
      currentPage: 1,
      perPage: 8
    }
  },
  mounted() {
    if (localStorage.getItem('input')) {
      try {
        this.input = JSON.parse(localStorage.getItem('input'))
      } catch (e) {
        localStorage.removeItem('input')
      }
    }
  },
  computed: {
    totalRows() {
      return this.companies.length
    },
    editing() {
      return (
        this.$store.state.companies.filter(c => c.editing === true).length > 0
      )
    },
    innState() {
      return (
        this.input.inn.length === 10 &&
        !this.$store.state.companies
          .map(c => {
            return c.id !== this.input.id ? c.inn : ''
          })
          .includes(this.input.inn)
      )
    },
    companyNameState() {
      return this.input.companyName.length > 0
    },
    ownerNameState() {
      return this.input.ownerName.length > 0
    },
    error() {
      return (
        this.editing &&
        !(this.innState && this.companyNameState && this.ownerNameState)
      )
    }
  },
  methods: {
    saveData() {
      const inputData = JSON.stringify(this.input)
      localStorage.setItem('input', inputData)
    },
    onDelete(id) {
      this.$store.dispatch('deleteCompany', id)
    },
    onEditing({ inn, companyName, ownerName, id }) {
      this.$store.dispatch('changeEditingStatus', id)
      this.input.inn = inn
      this.input.companyName = companyName
      this.input.ownerName = ownerName
      this.input.id = id
      this.saveData()
    },
    onSave() {
      this.$store.dispatch('changeCompanyInfo', {
        ...this.input,
        editing: false
      })
      localStorage.removeItem('input')
    },
    editingStatusReset() {
      if (this.editing)
        this.$store.dispatch('changeEditingStatus', this.input.id)
    }
  },
  components: {
    TableItem
  }
}
</script>

<style>
</style>

