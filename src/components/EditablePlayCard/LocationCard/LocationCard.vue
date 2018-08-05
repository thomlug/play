<template>
    <three-column-edit-card :clickFn="toggleEdit" :can-edit="canEdit" :editable="editable">    
        <!-- <img slot="left-content" src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/place%20(2).png?alt=media&token=dade46a3-57c5-4bbf-98c2-20496f94388f" class="location-icon"> -->
        <div slot="main-content">    
            
            <h6 v-if="!this.editable && (ground != null && ground != '')">
                <div class="fa fa-map-marker">
                <a :href="'https://www.google.com/maps/search/?api=1&query=' + this.ground" target="_blank" rel="noopener noreferrer">
                    {{this.ground}}
                </a>
                </div>
            </h6>
            <h6 v-else-if="!this.editable">
                No location added yet, contact team manager
            </h6>
             <div v-else>
                <h6>Location</h6>
                <input class="form-control" type="text" v-model="ground"> 
            </div>
            
        </div>    
    </three-column-edit-card>
</template>

<script>
import ThreeColumnEditCard from "../ThreeColumnEditableCard.vue";

export default {
  props: {
    fixture: {
        type: Object,
        required: true
    },
    canEdit: Boolean
  },   
  data() {
      return {
          editable: false
      }
  },

  computed: {
      ground: {
          //Need this computed property as the fixture prop changes
          get() {
              return this.fixture.ground
          },
          
          set(newGround) {
              this.fixture.ground = newGround;
          }
      }
  },

  components: {
    ThreeColumnEditCard
  },

  methods: {
      toggleEdit() {
          if (this.editable) {
              this.$emit('location-changed', this.ground)
          }
          this.editable = !this.editable;
      }
  }
};
</script>

<style scoped>
/* .location-icon {
  height: 1.8rem;
  border-radius: 20%;
  border: none;
  background: none;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: none;
} */

.form-control{
  color: rgb(175, 175, 175);
  font-size: 0.8rem;
  padding: 0.5rem;
  border: 0px;
  border-radius: 20px;
  border: 1px solid #e3e3e3;
  text-transform: uppercase;
  font-family: 'Roboto Condensed', sans-serif;
}

h3 {
  font-weight: 500;
  color: #50575e;
  margin-bottom: 0rem;
  text-align: center;
  font-size: 1rem;
}

h6 {
  color: rgb(175, 175, 175);
  font-weight: none;
  text-align: center;
  margin-bottom: 0rem;
  color: lightgray;
}

a {
    color: rgb(175, 175, 175);
    font-size: 1rem;
    font-weight: 400;
    font-family: roboto condensed;
}

.fa.fa-map-marker::before {
    font-size: 25px;
    vertical-align: sub;
}
</style>
