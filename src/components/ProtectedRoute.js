import React from "react"
import { Navigate } from "react-router-dom"
import useAuthStore from "../store/authStore"

const ProctectedRoute = ({children})=>{
    const isAuthenticated = useAuthStore((state)=>state.isAuthenticated)
    if(!isAuthenticated)
    {
        console.log('Wrong Login credentials')
        return <Navigate to='/login'/>
    }
    return children
}

export default ProctectedRoute;