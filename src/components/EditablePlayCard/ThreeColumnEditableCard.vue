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
                    <button class="btn edit-button" @click="clickFn()">
                        <i class="fa fa-edit"></i>
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

.edit-button {
    text-align: center;
    font-size: 0.8rem;
    color: #E5E5E5;
    background: white;
    height: 1.8rem;
    width: 1rem;
    border: 1px solid #E5E5E5;
    display: flex;
    align-items: center;
    justify-content: center;
    float: right;
    margin-right: 20px;
}

.edit-button:hover {
    cursor: pointer;
    border: 1px solid #77C7CE;
    color: #77C7CE;
}

</style>

