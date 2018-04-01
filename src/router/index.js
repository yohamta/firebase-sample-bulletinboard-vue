import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/Main';
import Comments from '@/components/Comments';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
    {
      path: '/:id/comments',
      name: 'Comments',
      component: Comments,
    },
  ]
});
