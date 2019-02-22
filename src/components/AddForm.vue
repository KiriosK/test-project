<template>
  <b-form id="form" @submit.prevent="onSubmit" @reset.prevent="onReset">
    <vue-bootstrap-typeahead
      size="lg"
      ref="suggestionInput"
      placeholder="Начните вводить информацию о компании..."
      :data="suggestions"
      :serializer="s => s.text"
      v-model="searchText"
      @hit="onSuggestionSelect"
    />

    <label for="innInput">Инн:</label>
    <b-form-input
      required
      id="innInput"
      placeholder="Введите ИНН компании"
      type="text"
      :state="innState"
      v-mask="'##########'"
      v-model="form.inn"
    />
    <b-form-invalid-feedback id="innFeedback">ИНН должен быть уникальным и состоять из десяти цифр</b-form-invalid-feedback>

    <label for="companyNameInput">Наименование:</label>
    <b-form-input
      required
      id="companyNameInput"
      placeholder="Введите наименование компании"
      type="text"
      :state="companyNameState"
      v-model="form.companyName"
    />
    <b-form-invalid-feedback
      id="companyNameFeedback"
    >Наименование компании должно быть непустой строкой</b-form-invalid-feedback>

    <label for="ownerNameInput">ФИО руководителя:</label>
    <b-form-input
      required
      id="ownerNameInput"
      placeholder="Введите ФИО руководителя компании"
      type="text"
      :state="ownerNameState"
      v-model="form.ownerName"
    />
    <b-form-invalid-feedback id="ownerNameFeedback">ФИО руководителя должно быть непустой строкой</b-form-invalid-feedback>
    <b-button
      type="submit"
      variant="primary"
      :disabled="!(innState && companyNameState && ownerNameState)"
    >Добавить</b-button>
    <b-button type="reset" variant="danger">Сброс</b-button>
  </b-form>
</template>

<script>
import { getSuggestions } from '../api/index'

const uniqid = require('uniqid')
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import _ from 'underscore'

export default {
  data: () => {
    return {
      form: {
        inn: '',
        companyName: '',
        ownerName: ''
      },
      suggestions: [],
      searchText: ''
    }
  },
  watch: {
    searchText: _.debounce(function(searchText) {
      this.request(searchText)
    }, 500)
  },
  computed: {
    innState() {
      return (
        this.form.inn.length === 10 &&
        !this.$store.state.companies.map(c => c.inn).includes(this.form.inn)
      )
    },
    companyNameState() {
      return this.form.companyName.length > 0
    },
    ownerNameState() {
      return this.form.ownerName.length > 0
    }
  },
  methods: {
    onSuggestionSelect(event) {
      let { inn, companyName, ownerName } = event.values
      this.form.inn = inn
      this.form.companyName = companyName
      this.form.ownerName = ownerName
    },
    onSubmit() {
      const newCompany = {
        inn: this.form.inn,
        companyName: this.form.companyName,
        ownerName: this.form.ownerName,
        editing: false,
        id: uniqid()
      }
      this.$store.dispatch('addCompany', newCompany)
      this.onReset()
    },
    onReset() {
      this.form.companyName = ''
      this.form.inn = ''
      this.form.ownerName = ''
      this.$refs.suggestionInput.inputValue = ''
    },
    request(searchText) {
      getSuggestions({
        query: searchText,
        count: 5
      })
        .then(res => {
          this.suggestions = res.data.suggestions.map(s => ({
            values: {
              inn: s.data.inn,
              companyName: s.value,
              ownerName: s.data.management.name
            },
            text: `${s.value}, Инн: ${s.data.inn}, Руководитель: ${
              s.data.management.name
            }`
          }))
        })
        .catch(err => console.log(err))
    }
  },
  components: {
    VueBootstrapTypeahead
  }
}
</script>

<style>
</style>