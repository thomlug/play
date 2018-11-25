<template>
    <div class="card play-card remove-margin">    
        <div class="card-block">    
            <div class="row">     
                <div class="left">   
                    <slot name="left-content"></slot>     
                </div> 
                <div class="center-content">   
                    <slot name="main-content"></slot>     
                </div>    
                <div v-if="canEdit" class="right">
                    <button v-if="!editable" class="btn edit-button" @click="clicked">
                        <i class="fa fa-pencil"></i>
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
        clickFn: Function,
        canEdit: Boolean,
        editable: Boolean
    },
    
    methods: {
        clicked() {
            this.clickFn();
        }
    }
};
</script>

<style scoped>
.play-card {
  margin-top: 10px;
  margin-bottom: 10px;
  /* box-shadow: 0 1px 3px#ddd, 0 1px 2px #ddd; */
  text-transform: uppercase;
  color: #50575e;
  border-color: transparent; 
  width: 100%;
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

.right > button {
    float: right;
    margin-right: 10px;
    text-align: center;
    font-size: 1.3rem;    
    height: 1.5rem;
    width: 1.5rem;    
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 15%;
    cursor: pointer;
}

.edit-button {    
    color: #E5E5E5;
    background: white;
    padding: 2px;
    /* border: 1px solid #E5E5E5;  */
}

.edit-button:hover {
    cursor: pointer;
    /* border: 1px solid #77C7CE; */
    color: darkgrey;
    padding: 2px;
    background: white;
}

.edit-button:focus{
    background: white;
    border: 0px;
    padding: 0px;
    outline: 0px;
}

.check-button{
    cursor: pointer;
    color: darkgrey;
    padding: 2px;
    background: white;
}

.check-button:focus{

    color: darkgrey;
    padding: 0px;
    background: white;
    border: 0px;
    outline: 1px solid transparent;
}

.fa-check{
    position: inherit;
    color: lightgray;
    background: none;
    box-shadow: none;
    padding: 0px;
    margin: auto;
}

.fa-check:active{
    position: inherit;
    color: grey;
    background: none;
    box-shadow: none;
    padding: 0px;
}

.fa-check:focus{
    position: inherit;
    color: grey;
    background: none;
    box-shadow: none;
    padding: 0px;
    border: none;
    outline: 3px solid pink ;
    box-shadow: none;
}

.btn:focus{
    box-shadow: 0 0 0 0 white;
}
.button:focus{
    outline: 0px;
}

.remove-margin{
    border-radius: 10px;
    box-shadow: none;
    margin-bottom: -5px;
}
</style>

