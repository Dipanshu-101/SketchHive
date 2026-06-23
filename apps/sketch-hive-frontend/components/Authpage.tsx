"use client";

export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-6 m-2 bg-white rounded">
            <div className="p-2 ">
                <input className="border border-gray-300 rounded p-2 color-black placeholder:text-gray-300
" type="text" placeholder="Email"></input>
            </div>
            <div className="p-2">
                
                <input className="border border-gray-300 rounded p-2 placeholder:text-gray-300" type="password" placeholder="Password"></input> 
            </div>

            <div className="pt-2 alingitems-center justify-center flex">
                
                <button className=" bg-red-800 rounded p-2" onClick={() => {
                 }}>{isSignin ? "Sign in" : "Sign up"}</button>
            </div>
        </div>
    </div>

}