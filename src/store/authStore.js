import {create} from 'zustand'
import {persist} from 'zustand/middleware'

const useAuthStore = create(
    persist(
        (set)=>({
            token:null,
            isAuthenticated: false,
            setToken:(token)=>{
                set({token:token,
                    isAuthenticated : !!token
                })
            },
            logout:()=>{
                set({
                    token:null,
                    isAunthenticated: false,
                })
            }
        }),
        {
            name: 'auth-storrage',
        }
    )
);

export default useAuthStore;