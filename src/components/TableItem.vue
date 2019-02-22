<template>
  <b-container>
    <div v-if="!row.item.editing">{{ row.value }}</div>
    <b-input
      type="text"
      :state="state"
      :value="value"
      v-if="row.item.editing"
      v-mask="mask"
      @update="$emit('data-change')"
      @input="$emit('input', $event)"
    />
    <b-form-invalid-feedback>{{errorText}}</b-form-invalid-feedback>
  </b-container>
</template>

<script>
export default {
  props: {
    value: String,
    errorText: String,
    row: {
      type: Object,
      default: () => {}
    },
    state: {
      type: Boolean,
      default: false
    },
    mask: {
      type: String,
      default: ''
    }
  }
}
</script>