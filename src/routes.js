import Login from './pages/Login.vue';
import Signup from './pages/Signup.vue';
import Home from './pages/Home.vue';
import Members from './pages/Members.vue';
import Teams from './pages/Teams.vue';
import Team from './pages/Team.vue';
import Competitions from './pages/Competitions.vue';
import Marketing from './pages/Marketing.vue';
import Results from './pages/Results.vue';
import Profile from './pages/Profile.vue';
import Fixtures from './components/Fixtures.vue';
import NewFixture from './pages/NewFixture.vue';
import Chat from './pages/Chat.vue';
import Join from './pages/Join.vue';

import { store } from './store/store';

function requireAuth(to, from, next) {
    function proceed() {
        if (store.getters.user) {
            next();
        } else {
            next('/login?redirect='+to.path);
        }
    }

    if (!store.getters.user && from.path !== '/login') {
        store.watch(state => state.user, (newUser, oldUser) => {
            if (newUser !== null) {
                proceed();
            }
        });
    } else {
        proceed();
    }
}


export default [
    { path: '/login', component: Login, name: 'login' },
    { path: '/signup', component: Signup, name: 'signup' },
    { path: '/join/:player_id?/:join_id?/:team_id?', component: Join, name: 'join', beforeEnter: requireAuth },
    { path: '/chat', component: Chat, name: 'chat', beforeEnter: requireAuth },
    { path: '/members', component: Members, name: 'members', beforeEnter: requireAuth },
    { path: '/teams', component: Teams, name: 'teams', beforeEnter: requireAuth },
    // { path: '/competitions', component: Competitions, name: 'competitions', beforeEnter: requireAuth },
    // { path: '/marketing', component: Marketing, name: 'marketing', beforeEnter: requireAuth },
    { path: '/fixtures', component: Fixtures, name: 'fixtures', beforeEnter: requireAuth },
    { path: '/newfixture', component: NewFixture, name: 'newfixture', beforeEnter: requireAuth },
    { path: '/results/:match_id', component: Results, name: 'results', beforeEnter: requireAuth },
    { path: '/profile/:player_id', component: Profile, name: 'profile', beforeEnter: requireAuth },
    { path: '/team/:team_id', component: Team, name: 'team', beforeEnter: requireAuth },
    { path: '/home', alias: '', component: Home, name: 'home', beforeEnter: requireAuth },
    { path: '*', redirect: '/' }
]
