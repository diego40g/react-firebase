import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { saveWebsite, getWebsite, updateWebsite, staticWeb } from "../firebase/api"
import { useParams, useNavigate } from "react-router-dom";
import { IoMdLink,IoMdCreate } from "react-icons/io";

const initialState={
    url:"",
    name:"",
    description:"",
}
export const WebsiteForm = (props) => {
    const [website,setWebsite]=useState(initialState)
    const params=useParams()
    const navigate=useNavigate()

    const handleInputChange=({ target: { name,value }}) => setWebsite({ ...website,[name]: value })

    const validURL = (str) => {
        var pattern=new RegExp(
            "^(https?:\\/\\/)?"+//protocolo
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|"+//nombre-del-dominio
                "((\\d{1,3}\\.){3}\\d{1,3}))"+//direccion ip (v4) 
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+//puerto y path
                "(\\?[;&a-z\\d%_.~+=-]*)?"+//query string
                "(\\#[-a-z\\d_]*)?$",
            "i"
        )//fragment locator
        return !!pattern.test(str);
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()

        if (!validURL(website.url)){
            return toast("Url invalido", {type: "warning", autoClose: 1000})
        }

        if (!params.id){
            await saveWebsite(website)
            toast("Nuevo Link agregado", {
                type: "success",
            })
            const data="{profile:'https://dipaz-solid.online/dipaz/profile/card#me',server:'dipaz-solid.online'}"
            const uri="dipaz"
            await staticWeb(data,uri)
        }else{
            await updateWebsite(params.id,website)
            toast("Actualizando", {
                type: "success"
            })
        }
        //Limpiar Form
        setWebsite(initialState)
        navigate("/")
    }

    const getLinkById=async(id)=>{
        try{
            const doc=await getWebsite(id)
            setWebsite({ ...doc.data() })
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        if (params.id){
            getLinkById(params.id)
        }
    }, [params.id])

    return (
        <div className="col-md-4 offset-md-4">
            <form onSubmit={handleSubmit} className="card card-body bg-secondary">
                <label htmlFor="url">Pega tu URL</label>
                <div className="input-group mb-3">
                    <div className="input-group-text bg-dark">
                        <IoMdLink/>
                    </div>
                    <input 
                        type="text" 
                        className="form-control"
                        placeholder="https://ejemplourl.xyz"
                        value={website.url}
                        name="url"
                        onChange={handleInputChange}
                    />
                </div>

                <label htmlFor="name">Nombre del website:</label>
                <div className="input-group mb-3">
                    <div className="input-group-text bg-dark">
                        <IoMdCreate/>
                    </div>
                    <input 
                        type="text" 
                        className="form-control"
                        placeholder="Nombre Website"
                        value={website.name}
                        name="name"
                        onChange={handleInputChange}
                     />
                </div>

                <label htmlFor="description">Añadir descripción</label>
                <textarea 
                    rows="3"
                    className="form-control mb-3" 
                    placeholder="Escribir una descripción" 
                    name="description"
                    value={website.description}
                    onChange={handleInputChange} 
                ></textarea>

                <button 
                    className="btn btn-primary btn-block"
                    disabled={!website.url || !website.name}
                >
                    {props.currentId === "" ? "Guardar":"Actualizar"}
                </button>
            </form>
        </div>
    )
}