import React, { useState, useEffect } from 'react';
import axios from "axios"
import * as yup from "yup"

function Form() {
    let initialForm ={
        name:"",
        email:"",
        password:"",
        terms:""
    };
    const [post, setPost] = useState([]);
    const [formState, setFormState] = useState(initialForm);

    const [errors, setErrors] = useState(initialForm);

    let formSchema = yup.object().shape({
        name: yup.string().required("name is required"),
        email: yup.string().email("must be a valid email address").required(),
        password: yup.string().required("must be ore than 6 characters"),
        terms: yup.boolean().oneOf([true], "please agree with us"),
    });

    let validateChange = e =>{
        yup.reach(formSchema, e.target.name)
            .validate(e.target.value)
            .then(valid => {
                setErrors({...errors, [e.target.name]: "" });
            })
            .catch(err => {
                console.log("error!", err);
                setErrors({...errors, [e.target.name]: err.errors[0] })
            });
    };

    console.log("error State", errors);
    useEffect(()=>{
        formSchema.isValid(formState).then( valid => {
            console.log("valid?", valid);
            //setisButtonDisabled(!valid);
        }); 
    }, [formState]);

    let submitForm = e => {
        e.preventDefault();
        axios
            .post("https://reqres.in/api/users", formState)
            .then(response => {
                setPost(response.data);
                setFormState({
                    name:"",
                    email:"",
                    password:"",
                    terms:""
                });
            })
            .catch(err => console.log(err.response));
    };

    let inputChange = e => {
        console.log("input changed!", e.target.value);
        e.persist();
        let newFormData ={
            ...formState,
            [e.target.name]:
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        };
        validateChange(e);
        setFormState(newFormData);
    };


    return(
    <form onSubmit={submitForm}>
        <label htmlFor="name">
           Name <input id="name" type="text" name="name" onChange={inputChange} value={formState.name} />
    {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
        </label>

        <label htmlFor="email">
           Email <input type="text" name="email" onChange={inputChange} value={formState.email} />
    {errors.email.length > 0 ? (
    <p className="error">{errors.email}</p>
    ) : null}
        </label>

        <label htmlFor="password">
           Password <input type="password" name="password" value={formState.password} onChange={inputChange} />
           {errors.password.length < 6 ? (<p className="error">{errors.password}</p>) : null }
        </label>

        <label htmlFor="terms" className="terms">
            <input type="checkbox" name="terms" checked={formState.terms} onChange={inputChange}/>
            {errors.terms.length > 0 ? (<p className="error">{errors.terms}</p>) : null}
        </label>

        <pre>{JSON.stringify(post, null, 2)}</pre>

        <button>Submit</button>
    </form>
    );
}

export default Form;