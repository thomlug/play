import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import Home from './pages/Home.vue'
import Members from './pages/Members.vue'
import Teams from './pages/Teams.vue'
import Team from './pages/Team.vue'
import Competitions from './pages/Competitions.vue'
import Marketing from './pages/Marketing.vue'
import Results from './pages/Results.vue'
import Profile from './pages/Profile.vue'
import Fixtures from './components/Fixtures.vue'
import NewFixture from './pages/NewFixture.vue'
import Chat from './pages/Chat.vue'

function requireAuth(to, from, next) {
    if (!firebase.auth().currentUser) {
        console.log("Not logged in");
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    } else {
        console.log("User is logged in as:", auth.currentUser.uid);
        next();
    }
}

export default [
    { path: '/login', component: Login, name: 'login' },
    { path: '/signup', component: Signup, name: 'signup' },
    { path: '/chat', component: Chat, name: 'chat', meta: { beforeEnter: requireAuth } },
    { path: '/members', component: Members, name: 'members', meta: { beforeEnter: requireAuth } },
    { path: '/teams', component: Teams, name: 'teams', meta: { beforeEnter: requireAuth } },
    { path: '/competitions', component: Competitions, name: 'competitions', meta: { beforeEnter: requireAuth } },
    { path: '/marketing', component: Marketing, name: 'marketing', meta: { beforeEnter: requireAuth } },
    { path: '/fixtures', component: Fixtures, name: 'fixtures', meta: { beforeEnter: requireAuth } },
    { path: '/newfixture', component: NewFixture, name: 'newfixture', meta: { beforeEnter: requireAuth } },
    { path: '/results/:match_id', component: Results, name: 'results', meta: { beforeEnter: requireAuth } },
    { path: '/profile/:player_id', component: Profile, name: 'profile', meta: { beforeEnter: requireAuth } },
    { path: '/team/:team_id', component: Team, name: 'team', meta: { beforeEnter: requireAuth } },
    { path: '/home', alias: '', component: Home, name: 'home', meta: { beforeEnter: requireAuth } }
]
