<template>
  <b-container id="app">
    <AddForm/>
    <CompanyList :companies="$store.state.companies"/>
  </b-container>
</template>

<script>
import CompanyList from './components/CompanyList.vue'
import AddForm from './components/AddForm.vue'

export default {
  components: {
    AddForm,
    CompanyList
  }
}
</script>

<style>
</style>
