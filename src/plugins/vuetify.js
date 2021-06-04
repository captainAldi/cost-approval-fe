import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: colors.blue,
        secondary: colors.teal.darken4,
        accent: colors.teal.accent4,

        error: colors.deepOrange.darken1,
        info: colors.grey.darken1,
        success: colors.green.darken1,
        warning: colors.amber.darken1,
      },
      light: {
        primary: '#1976D2',
        secondary: colors.teal.lighten3,
        accent: colors.teal.accent4,

        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      }
    }
  },
});
