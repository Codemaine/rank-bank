import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
 

function Login(props) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    let emailError = false;
    let passError = false;
    const [isButtonLoading, setIsButtonLoading] = React.useState(false);
    const onSubmit = data => {
       axios({
           method: "POST",
           url: "http://localhost:4000/login",
           headers: {
             "Access-Control-Allow-Origin": true
           },
           data: {
               email: data.email,
               password: data.email
           }
       }).then((data) => {
           console.log(data.data);
            switch (data.data.error) {
                case "an account has been found with same email":
                    console.log("hi");
                      toast.error("An account has been found with the same email")
                    break;
                case undefined:
                    toast.success("SignUp successfull")
                    if(data.data.token){
                        localStorage.setItem("userToken", data.data.token)
                        window.location.replace('/')
                    }
                    break;
                default:
                    break;
            }
        }).catch((err) => console.log(err))
   };
    if (errors.password === undefined) {
        passError = true
    }
    if (errors.email === undefined) {
        emailError = true
    }

        React.useEffect(() => {
            if(localStorage.getItem('userToken')){
                axios({
                    method: "POST",
                    url: "http://localhost:4000/vertify-token",
                    headers: {
                        "Access-Control-Allow-Origin": true
                      },
                    data: {
                        accountToken: localStorage.getItem('userToken')
                    }
                }).then(data => {
                    console.log(data)
                    if (data.data.isLegit){
                        window.location.replace('/')
                    } 
                }).catch(err => console.log(err))
            }
        }, [])
    

    return (
        <div className="d-flex justify-content-center h-screen" style={{  height: "100vh" }}>
            <div className="row align-self-center">
                <div className="card col p-5" style={{ width: "50em" }}>
                    <h1 className="card-title text-center">Login</h1>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                <input type="email"  className={emailError ? "form-control" : "form-control border-danger"} id="exampleInputEmail1" aria-describedby="emailHelp" {...register("email", {
                                    required: {
                                        value: true,
                                        message: "The email field is required"
                                    }, pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })} />
                                <ErrorMessage errors={errors} name="email" as="p" className="form-text text-danger" />

                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                <input type="password" className={passError ? "form-control" : "form-control border-danger"} onSubmit={() => setIsButtonLoading(!isButtonLoading)} id="exampleInputPassword1" {...register("password", {
                                    minLength: {
                                        value: 8,
                                        message: "The passsword is too short"
                                    }, maxLength: {
                                        value: 20,
                                        message: "The password is too long"
                                    }, required: {
                                        value: true,
                                        message: "The password field is required"
                                    }
                                })} />
                                <ErrorMessage errors={errors} name="password" as="p" className="form-text text-danger" />
                            </div>
                            {isButtonLoading ?
                                <button type="submit" disabled className="btn btn-primary">
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </button> : <button type="submit" className="btn btn-primary">Login</button>
                            }
                        </form>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    )
}

export default Login
