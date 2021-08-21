import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import generateUniqueId from 'generate-unique-id'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
 

function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [name, setName] = React.useState("");
    let nameError = false;
    let emailError = false;
    let passError = false;
    const [account_number, setAccount_number] = React.useState("");
    const [isButtonLoading, setIsButtonLoading] = React.useState(false);
    const onSubmit = data => {
        setIsButtonLoading(true)
       axios({
           method: "POST",
           url: "https://rank-bank-bkqombvhm-codemaine.vercel.app/signup",
           data: {
               name: data.name,
               account_number: account_number,
               email: data.email,
               password: data.email
           }
       }).then((data) => {
           console.log(data.data.error);
            switch (data.data.error) {
                case "an account has been found with same email":
                    setIsButtonLoading(false)
                      toast.error("An account has been found with the same email")
                    break;
                case undefined:
                    toast.success("SignUp successfull")
                    localStorage.setItem('userToken', data.data.token)
                    window.location.replace('/')
                    setIsButtonLoading(false)
                    break;
                default:
                    break;
            }
        }).catch((err) => console.log(err))
   };

    if (errors.name === undefined) {
        nameError = true
    }
    if (errors.password === undefined) {
        passError = true
    }
    if (errors.email === undefined) {
        emailError = true
    }

    React.useEffect(() => {
        setAccount_number(generateUniqueId({
            length: 10,
            useLetters: false,
            useNumbers: true
        }))

    }, [])




    return (
        <div className="d-flex justify-content-center h-screen" style={{  height: "100vh" }}>
            <div className="row align-self-center">
                <div className="card col p-5" style={{ width: "50em" }}>
                    <h1 className="card-title text-center">SignUp</h1>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="mb-3">
                                <label htmlFor="inputPassword5" className="form-label">Full Name</label>
                                <input onChange={text => setName(text.target.value)} value={name} type="name" id="inputPassword5" className={nameError ? "form-control" : "form-control border-danger"} aria-describedby="passwordHelpBlock" {...register("name", {
                                    required: {
                                        value: true,
                                        message: "The name field is required"
                                    }
                                })} />
                                <ErrorMessage errors={errors} name="name" as="p" className="form-text text-danger" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                <input type="email" className={emailError ? "form-control" : "form-control border-danger"} id="exampleInputEmail1" aria-describedby="emailHelp" {...register("email", {
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
                                </button> : <button type="submit" className="btn btn-primary">Submit</button>
                            }
                        </form>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    )
}

export default SignUp
