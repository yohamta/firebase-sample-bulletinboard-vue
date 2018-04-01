<template id="comments">
  <div>
    <div class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><router-link :to="{path: `/`}">Bulletin Board</router-link></li>
        <li class="is-active"><a href="#" aria-current="page">Comments</a></li>
      </ul>
    </div>
    <div v-show="!loading">
      <h2>{{thread.name}}</h2>
      <article class="media">
        <div class="media-content">
          <div class="field">
            <div class="control">
              <input class="input" type="text" v-model="newComment.username" placeholder="User name"/>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <textarea class="textarea" rows="3" v-model="newComment.comment" placeholder="Comment"/>
            </div>
          </div>
          <button v-show="!submitting" class="button is-info" type="button" v-on:click="writeComment()">Submit</button>
          <button v-show="submitting" class="button is-info is-loading" type="button">Submit</button>
        </div>
      </article>
      <article class="media">
        <div class="media-content">
          <div class="content">
            <p>
              <strong>{{thread.username}}</strong>
              <br />
              {{thread.comment}}
            </p>
          </div>
        </div>
      </article>
      <article class="media" v-for="item in comments" v-bind:key="item.number">
        <div class="media-content">
          <div class="content">
            <p>
              {{item.number}}
              <strong>{{item.username}}</strong>
              <small>{{item.updateTime}}</small>
              <br />
              {{item.comment}}
            </p>
          </div>
        </div>
      </article>
    </div>
    <div>
      <div class='spinner' v-show="loading"></div>
    </div>
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
      loading: false,
      submitting: false,
      threadId: '',
      thread: {
        name: '',
        username: '',
        comment: '',
        count: 0,
      },
      comments: [],
      newComment: {
        username: 'Anonymous user',
        comment: '',
        updateTime: '',
      },
      unsubscribe: () => {},
    };
  },
  mounted() {
    this.loading = true;
    this.threadId = this.$route.params.id;
    const db = firebase.firestore();
    db.collection("threads").doc(this.threadId).get().then((doc) => {
      this.thread = doc.data();
      this.refresh();
    }).catch((e) => {
      this.displayError(e);
    });
  },
  methods: {
    displayError(e) {
      console.log(e);
      alert('error');
    },
    refresh() {
      this.loading = true;
      const db = firebase.firestore();
      db.collection("comments").doc(this.threadId).collection("comments")
      .orderBy("updateTime", "desc").limit(1000)
      .get().then((querySnapshot) => {
        let commentNumber = this.thread.count;
        this.comments = [];
        querySnapshot.forEach((doc) => {
          let dat = doc.data();
          dat.updateTime = this.formatDate(dat.updateTime);
          dat.number = commentNumber--;
          this.comments.push(dat);
        });
        this.loading = false;
      }).catch((e) => {
        this.displayError(e);
      });
      this.unsubscribe();
      this.unsubscribe = db.collection("comments").doc(this.threadId).collection("comments")
      .onSnapshot((snapshot) => {
        snapshot.docChanges.forEach((change) => {
          if (change.type === "added") {
            let dat = change.doc.data();
            dat.updateTime = this.formatDate(dat.updateTime);
            dat.number = this.comments.length > 0 ? this.comments[0].number + 1: 1;
            this.comments.unshift(dat);
          }
        });
      });
    },
    writeComment() {
      this.submitting = true;
      this.newComment.threadId = this.threadId;
      axios.post(config.endpoints.addComment, this.newComment)
      .then(() => {
        this.newComment.comment = '';
        this.submitting = false;
      })
      .catch((e) => {
        this.displayError(e);
        this.submitting = false;
      })
    },
  },
});
</script>
