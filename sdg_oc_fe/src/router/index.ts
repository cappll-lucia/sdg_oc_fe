import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { routerRoutes } from "./routes";
import { useUserStore } from "@/stores/UsersStore";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routerRoutes
});

router.beforeEach((to: RouteLocationNormalized, _ , next: NavigationGuardNext)=>{
    const auth: boolean = to.meta.auth as boolean;
    const userStore = useUserStore();
	const user = userStore.getMe
    if ( auth && !userStore.isSignedIn){
		next('/login');
	} else if (to.fullPath === '/login' && userStore.isSignedIn) {
		next('/');
	} else if (to.meta.requireAdmin && user?.role !== 'admin') {
		return next('/not-admin'); 
	} else {
		next();
	}
});

export default router;