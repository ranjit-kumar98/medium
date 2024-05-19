import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SignupType } from "ranjit123-tsb-common-app"
import axios  from "axios"
import { BACKEND_URL } from "../config"




export const Auth = ( {type} : { type : "signup" | "signin"}) => {

    const [postInput, setPostInput] = useState<SignupType>({
        email:"",
        password:"",
        name: ""

    })
    const navigate = useNavigate();


    async function sendRequest(){
        try {
            console.log("a");
            
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type=="signup"?"signup":"signin"}`, postInput);
            const jwt = response.data.token;
            console.log(jwt);
            
            localStorage.setItem("token", jwt);
            console.log("c");
            
            navigate('/blogs');
            
            
        } catch (error) {
            alert("some error occured")
            
        }
      

    }
    return <div  className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
            <div className="text-3xl font-extrabold px-10">
            Create An Account
        </div>

        <div className="text-slate-400 px-10">
         {type == "signup" ? "Already have an account?" : "Don't have an account?"}
         <Link className="pl-2 underline" to={  type == "signup" ? "/signin" : "/signup"}> {type == "signup" ? "Sign in" : "Sign up"} </Link>
        </div>
        
        
        <div className="pt-8">
           {type == "signup"?  <LabelledInput label="Username" placeholder="Enter username"  onChange={ (e) => {
                setPostInput( (postInput) => ({
                    ...postInput,
                    name:e.target.value
                }))

            }} /> : null }
             <LabelledInput label="Email" placeholder="Enter email"  onChange={ (e) => {
                setPostInput( (postInput) => ({
                    ...postInput,
                    email:e.target.value
                }))

            }} />
             <LabelledInput label="Password" type="password" placeholder="Enter password"  onChange={ (e) => {
                setPostInput( (postInput) => ({
                    ...postInput,
                    password:e.target.value
                }))

            }} />

             <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">{type == "signin" ? "Sign in" : "Sign up"} </button>
            </div>
            </div>
        
        </div>
    </div>
}


interface LabelledInputType {
    label: string,
    placeholder: string,
    onChange: (e : ChangeEvent<HTMLInputElement>) => void,
    type?: string
}
function LabelledInput ({ label, placeholder, onChange, type} : LabelledInputType) {
    return <div className="pt-4">
        <label  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-black"> {label} </label>
            <input onChange={onChange} type= {type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder= {placeholder} required />
    </div>
}