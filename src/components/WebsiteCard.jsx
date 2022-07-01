import { deleteWebsite } from "../firebase/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { GrClose } from "react-icons/gr";

export function WebsiteCard({ link }) {
  const navigate=useNavigate()

  const onDeleteLink=async(id)=>{
    if(window.confirm("¿Esta seguro de querer borrar este link?")){
        await deleteWebsite(id)
        toast("Link eliminado satisfactoriamente", {
            type: "error",
            autoClose: 2000,
        })
    }
  }

  return (
    <div 
        className="card mb-3 card-website"
        key={link.id}
        onClick={()=>navigate(`/edit/${link.id}`)}
    >
        <div className="card-body">
            <div className="d-flex justify-content-between">
                <h4>{link.name}</h4>
                <button 
                    className="btn btn-danger btn-sm d-flex align-items-center"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDeleteLink(link.id)
                    }}
                >
                    <GrClose/>
                </button>
            </div>
            <p>{link.description}</p>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
                Ir al Website
            </a>
        </div>
    </div>
  )
}
