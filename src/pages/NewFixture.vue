<template>
  <div class="container">
    <form>
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <h1>New Fixture</h1>
          <hr>
          <div class="form-group">
            <label for="homeTeam">Home Team</label>
            <input
                type="text"
                id="homeTeam"
                class="form-control">
          </div>

        </div>

      </div>

    </form>

  </div>

</template>

<script>
export default {
  data() {
    return {
      homePhoto: '',
      awayPhoto: '',
      homeTeam: '',
      awayTeam: '',
      date: '',
      ground: ''
    }
  }
}
</script>

<style lang="css">
</style>
