<template>
    <v-dialog v-model="internalModelValue" max-width="500">
      <template #default>
        <v-card>
          <v-card-title class="d-flex justify-center align-center postition-relative">
            <span class="text-center">{{ title }}</span>
            <v-btn icon class="position-absolute right-0" @click="closeModal">
                <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
  
          <v-card-text>
            <slot></slot>
          </v-card-text>

          <!-- Message Display -->
            <div v-if="message" :class="messageClass" class="py-2 px-4 text-center">
            {{ message }}
            </div>
          
          <v-card-actions class="d-flex justify-center">
            <slot name="actions"></slot>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            default: "Modal Title",
        },
        message: {
            type: String,
            default: "",
        },
        messageStatus: {
            type: String,
            default: "", // "success" or "error"
        },
    },
    emits: ["update:modelValue", "open", "close"],
    data() {
      return {
        internalModelValue: this.modelValue, // Initialize internal state with prop value
      };
    },
    // I leveraged ChatGPT here to assist with creating my computed values
    computed: {
    messageClass() {
        return this.messageStatus === "success"
            ? "bg-light-green text-green-dark"
            : this.messageStatus === "error"
            ? "bg-light-red text-red-dark"
            : "";
        },
    },
    watch: {
      // Watch for changes in the modelValue prop
      modelValue(newValue) {
        this.internalModelValue = newValue;
      },
      // Emit changes to the parent when internal value changes
      internalModelValue(newValue) {
        this.$emit("update:modelValue", newValue);
      },
    },
    methods: {
      closeModal() {
        this.internalModelValue = false; // Update internal state
      },
    },
  };
  </script>
  
<style>
.bg-light-green {
    background-color: #d4edda;
}   
.text-green-dark {
    color: #155724;
}
.bg-light-red {
    background-color: #f8d7da;
}
.text-red-dark {
    color: #721c24;
}
</style>