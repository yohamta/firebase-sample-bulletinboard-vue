<template id="main">
  <div>
    <div class="field is-grouped">
      <div class="control">
        <button class='button' v-on:click="refresh()">
          Refresh
        </button>
        <button class='button field' v-on:click="createThread()">
          New Thread
        </button>
      </div>
    </div>
    <section class="hero is-primary is-small" v-show="succeed">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Create New Thread Succeed!
          </h1>
          <h2 class="subtitle">
            You can see the new thread after few seconds.
          </h2>
        </div>
      </div>
    </section>
    <div class="box" v-show="newThreadInput">
      <form>
        <div class="field">
          <label class="label">Thread Name
            <div class="control">
              <input class="input" type="text" v-model="newThread.name" placeholder="Thread name" />
            </div>
          </label>
        </div>
        <div class="field">
          <label class="label">Username
            <div class="control">
              <input class="input" type="text" v-model="newThread.username" placeholder="User name"/>
            </div>
          </label>
        </div>
        <div class="field">
          <label class="label">Comment<br />
            <div class="control">
              <textarea class="textarea" rows="5" v-model="newThread.comment" placeholder="Comment"/>
            </div>
          </label>
        </div>
        <button v-show="!loading" class="button is-primary" type="button" v-on:click="createThreadExec()">Submit</button>
        <button v-show="loading" class="button is-primary is-loading" type="button">Submit</button>
      </form>
    </div>
    <div class="panel">
      <div class="panel-heading">Threads</div>
      <router-link class="panel-block" :to="{path: `/${item.id}/comments`}" v-for='(item, idx) in threads' v-bind:key='idx'>
        <span style="width: 40%">{{item.name}}</span>
        <span style="width: 60%; text-align: right;">
          Comments:({{item.count}}), 
          {{item.updateTime}}
        </span>
      </router-link>
    </div>
    <div class='spinner' v-show="loading"></div>
  </div>
</template>

<script type="text/javascript">
'use strict';
import firebase from 'firebase';
import 'firebase/firestore';
import axios from 'axios';
import config from '@/config/dev.config';

export default({
  mixins: [require('@/Common').default],
  data() {
    return {
      threads: [],
      newThreadInput: false,
      newThread: {
        name: '',
        username: 'Anonymous user',
        comment: '',
        updateTime: '',
        count: 1,
      },
      loading: false,
      lastVisible: null,
      succeed: false,
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    createThread() {
      this.newThreadInput = !this.newThreadInput;
      this.succeed = false;
    },
    openThread(item) {
      this.$route.router.go(`comments?thread=${item.id}`)
    },
    displayError(e) {
      console.log(e);
      alert(e);
    },
    createThreadExec() {
      this.newThread.name = this.newThread.name.replace(/\r|\n/g, '');
      this.succeed = false;
      if (!this.newThread.username) {
        this.displayError('Please input Username');
        return;
      }
      if (!this.newThread.comment) {
        this.displayError('Please input Comment');
        return;
      }
      if (!this.newThread.name) {
        this.displayError('Please input Thread Name');
        return;
      }
      if (this.newThread.name.length > 100) {
        this.displayError('Thread name is too long');
        return;
      }
      if (this.newThread.username.length > 50) {
        this.displayError('User name is too long');
        return;
      }
      if (this.newThread.comment.length > 400) {
        this.displayError('Comment is too long');
        return;
      }
      this.loading = true;
      axios.post(config.endpoints.createThread, this.newThread)
      .then(() => {
        this.newThreadInput = false;
        this.newThread.name = '';
        this.newThread.comment = '';
        this.succeed = true;
        this.refresh();
      }).catch((e) => {
        this.displayError(e);
      });
    },
    refresh() {
      this.loading = true;
      this.succeed = false;
      const db = firebase.firestore();
      db.collection("threads")
      .orderBy("updateTime", "desc")
      .limit(100).get().then((querySnapshots) => {
        this.threads = [];
        this.lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
        querySnapshots.forEach((doc) => {
          let dat = doc.data();
          dat.id = doc.id;
          dat.updateTime = this.formatDate(dat.updateTime);
          this.threads.push(dat);
        });
        this.loading = false;
      }).catch((e) => {
        this.displayError(e);
      });
    }
  },
});
</script>
