import { createStore } from 'vuex'

import base from './modules/base'

export default createStore({
  ...base,
  modules: {
    // ...
  }
})
