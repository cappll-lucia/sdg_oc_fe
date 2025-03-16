import { http } from "@/api/http";
import token from "@/api/token";
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import { JwtUser } from "@/api/entities/jwtUser";


export const useUserStore = defineStore('UserStore', {
    state: ()=>({
        user: {} as JwtUser
    }),

    actions: {
        async singin(username: string, password: string){
            try{
                const res = await http.post('/auth/signin', {username, password});
                console.log(res)
                token.set(res.data.data.access_token);
                this.user = jwtDecode(res.data.data.access_token);
            }catch(error: any){
                throw error
            }
        },

        async signOut(){
            token.delete();
			window.location.reload();
        }
    },

    getters:{
        isSignedIn: ()=> token.get(),

        getMe: ()=>{
            const decodedToken = token.get();
            if(decodedToken){
                return jwtDecode(decodedToken) as JwtUser;
            }else{
                return null;
            }
        }
    }
})