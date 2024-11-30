/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// created the 
const myLuganoTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#EEEEEE',
    'surface-variant': '#BDBDBD',
    'on-surface-variant': '#EEEEEE',
    primary: '#FF641C',
    'primary-darken-1': '#FF6219',
    secondary: '#00730A',
    'secondary-darken-1': '#00730A',
    error: '#B00020',
    info: '#2196F3',
    success: '#76FF4D',
    warning: '#FFC14D',
  }
}

// variables: {
//   'border-color': '#000000',
//   'border-opacity': 0.12,
//   'high-emphasis-opacity': 0.87,
//   'medium-emphasis-opacity': 0.60,
//   'disabled-opacity': 0.38,
//   'idle-opacity': 0.04,
//   'hover-opacity': 0.04,
//   'focus-opacity': 0.12,
//   'selected-opacity': 0.08,
//   'activated-opacity': 0.12,
//   'pressed-opacity': 0.12,
//   'dragged-opacity': 0.08,
//   'theme-kbd': '#212529',
//   'theme-on-kbd': '#FFFFFF',
//   'theme-code': '#F5F5F5',
//   'theme-on-code': '#000000',
// }

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'myLuganoTheme',
    themes: {
      myLuganoTheme,
    },
  }
})
