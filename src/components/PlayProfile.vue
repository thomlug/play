<template>
<div class="profile-bg">  
    <div class="profile-box">    
        <div class="profile-banner text-center">    
            <h1>{{this.title}}</h1>    
        </div>    
      
    
        <div class="profile-content">    
            <slot name="main-content"></slot> 
            <div class="profile-header">    
               <slot name="header"></slot>    
            </div>    
        </div> 
        <div class="profile-content">    
            <slot name="other-content"></slot>    
        </div> 
    </div>
  </div>  
</template>



<script>
export default {
  props: {
    title: String
  },
  
};
</script>

<style scoped>
/* .profile-box {
  margin-top: 1vh;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 3px 3px -3px rgba(128, 126, 128, 1);
} */

.profile-bg{
  background-color: whitesmoke;
}
.profile-banner {
  width: 100%;
  background-color: #2bcad0;
  color: #ffffff;
  box-shadow: 1px 3px 3px -3px grey;
  background-image: linear-gradient(90deg,#2acad0, turquoise, #2acad0);
}

.profile-header {
  margin: 0rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  float: right;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 0rem;
  margin-top: 0rem;
  box-shadow: 3px gray;
}
</style>

