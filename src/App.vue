<template>
  <div id="app">
    <section class="section">
      <div class="container is-fluid">
        <div class="content">
          <h1 class="title">Bulletin Board</h1>
          <div class="subtitle">sample application</div>
          <router-view/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import 'bulma/css/bulma.css'
import firebase from 'firebase';
import config from '@/config/dev.config';

firebase.initializeApp(config.firebase);

export default {
  name: 'App',
}
</script>

<style>
/* Loading animation */
@keyframes spinner {
  to {transform: rotate(360deg);}
}

.spinner:before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 50%;
  border: 2px solid #ccc;
  border-top-color: #333;
  animation: spinner .6s linear infinite;
}
</style>
