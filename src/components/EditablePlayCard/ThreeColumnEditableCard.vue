<template>
    <div class="card play-card">    
        <div class="card-block">    
            <div class="row">      
                <div class="left">    
                    <slot name="left-content"></slot>
                </div>    
                <div class="center-content">   
                    <slot name="main-content"></slot>     
                </div>    
                <div class="right">
                    <button v-if="!editable" class="btn edit-button" @click="clicked">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button v-else class="btn check-button" @click="clicked">
                        <i class="fa fa-check"></i>
                    </button>
                </div>    
            </div>    
        </div>    
    </div>
</template>

<script>
export default {
    props: {
        clickFn: Function
    },
    
    data: function() {
        return {
            editable: false,
        }
    },
    methods: {
        clicked() {
            this.editable = !this.editable;
            this.clickFn();
        }
    }
};
</script>

<style scoped>
.play-card {
  margin-top: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  text-transform: uppercase;
  color: #50575e;
}
/* clock/time icon column styling */
.center-content {
  float: left;
  width: 50%;
  text-align: center;
}

.left,
.right {
  width: 25%;
}

button {
    float: right;
    margin-right: 20px;
    text-align: center;
    font-size: 2rem;    
    height: 1.8rem;
    width: 1rem;    
    display: flex;
    align-items: center;
    justify-content: center;   
}


.edit-button {    
    color: #E5E5E5;
    background: white;
    padding: 0px;
    /* border: 1px solid #E5E5E5;  */
}

.edit-button:hover {
    cursor: pointer;
    /* border: 1px solid #77C7CE; */
    color: darkgrey;
    padding: 0px;
    background: white;
}

.edit-button:focus{
    background: white;
    border: 0px;
    padding: 0px;
}

.check-button{
    cursor: pointer;
    color: darkgrey;
    padding: 0px;
    background: white;
}

.check-button:focus{

    color: darkgrey;
    padding: 0px;
    background: white;
    border: 0px;
}

</style>

