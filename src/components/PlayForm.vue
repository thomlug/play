<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4 col-sm-4 col-xs-12"></div>
            <div class="col-md-4 col-sm-4 col-xs-12">
                <div class="centered-col">
                    <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo.jpg?alt=media&token=1c35a16a-5311-4c41-a91d-a264505a71a8" class="logo">
                    <div class="card form-container">
                        <div class="card-body">
                            <slot></slot>
                        </div>
                    </div>  
                </div>              
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12"></div>
        </div>
    </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
    .logo {
        border-radius: 50%;
        height: 4rem;
        z-index: 9999 !important;
        margin-top: 15vh;
    }

    .centered-col{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .form-container{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 0 2rem 0;
        -webkit-box-shadow: 0px 0px 16px 3px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 16px 3px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 16px 3px rgba(0,0,0,0.75);  
        position: relative;
    }
</style>
