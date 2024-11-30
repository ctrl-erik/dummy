<template>
    <v-dialog v-model="internalIsOpen" persistent max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>
        <v-card-text>
          <slot />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { defineComponent, watch, ref } from 'vue';
  
  export default defineComponent({
    name: 'Modal',
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        default: 'Modal Title',
      },
    },
    setup(props, { emit }) {
      const internalIsOpen = ref(props.modelValue);
  
      const closeModal = () => {
        internalIsOpen.value = false;
        emit('update:modelValue', false); // Sync with the parent
        emit('close'); // Emit close event for extra logic
      };
  
      const openModal = () => {
        internalIsOpen.value = true;
        emit('update:modelValue', true); // Sync with the parent
        emit('open'); // Emit open event for extra logic
      };
  
      watch(() => props.modelValue, (newValue) => {
        internalIsOpen.value = newValue;
      });
  
      return {
        internalIsOpen,
        closeModal,
        openModal,
      };
    },
  });
  </script>
  