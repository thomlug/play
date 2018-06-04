<script>
export default {
    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    convertCamelCaseToSentence(str){
        return str.replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str){ return str.toUpperCase(); })
    },
    defer() {
      var res, rej;

      var promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
      });

      promise.resolve = res;
      promise.reject = rej;

      return promise;
    }
}
</script>
