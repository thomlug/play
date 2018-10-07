<template>
    <div class="container-fluid">
        <div class="centered-col">
            <img src="https://firebasestorage.googleapis.com/v0/b/play-14e3e.appspot.com/o/logo.jpg?alt=media&token=1c35a16a-5311-4c41-a91d-a264505a71a8" class="logo">
            <slot name="page-header"></slot>
            <div class="card form-container">
                <div class="card-body">
                    <slot></slot>   
                </div>
            </div>
            <slot name="additional-info"></slot>
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
        margin: 2vh 0;
    }

    .centered-col{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 2rem 0 2rem;
    }

    .form-container{
        margin-top: 2vh;
        width: 20rem;
        padding: 2rem 0 2rem 0;
        /* -webkit-box-shadow: 3px 3px 3px -3px rgba(0,0,0,0.75);
        -moz-box-shadow: 3px 3px 3px -3px rgba(0,0,0,0.75); */
        box-shadow: 0px 1px 6px 0px #ddd;
        border: 0px;
    }
</style>
