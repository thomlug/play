<script>

import helpers from './helpers.vue';
var helper = {};
helper.install = function install(Vue) {
    Vue.prototype.$helpers = helpers;
};

export default helper;

</script>