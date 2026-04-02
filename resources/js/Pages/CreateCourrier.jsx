import { useEffect, useState } from "react"
import CreatableSelect from "react-select/creatable"
import { router } from "@inertiajs/react"
import Sidebar from "../Components/Sidebar"

export default function CreateCourrier(){

const params = new URLSearchParams(window.location.search)
const editId = params.get("id")

const [numero,setNumero] = useState("")
const [annee,setAnnee] = useState(new Date().getFullYear())
const [objet,setObjet] = useState("")
const [type,setType] = useState("Officiel")
const [date,setDate] = useState("")
const [description,setDescription] = useState("")
const [expediteur,setExpediteur] = useState("")
const [nombrePieces,setNombrePieces] = useState("")
const [observations,setObservations] = useState("")
const [natureId,setNatureId] = useState("1")
const [natures,setNatures] = useState([])
const [fichier,setFichier] = useState(null)
const [loading,setLoading] = useState(false)

useEffect(()=>{

fetch("/api/courriers/next-number?annee="+annee, { credentials: "include" })
.then(res=>res.json())
.then(data=>{
if(!editId){
setNumero(data.numero)
}
})

fetch("/api/natures", { credentials: "include" })
.then(res=>res.json())
.then(data=>{
setNatures(data)
})

if(editId){

fetch("/api/courriers/"+editId, { credentials: "include" })
.then(res=>res.json())
.then(data=>{

setNumero(data.numero)
setAnnee(data.annee)
setObjet(data.objet)
setType(data.type)
setDate(data.date_courrier)
setDescription(data.description || "")
setExpediteur(data.expediteur || "")
setNombrePieces(data.nombre_pieces || "")
setObservations(data.observations || "")
setNatureId(data.nature_id)

})

}

},[annee])

const submitForm = (e)=>{

e.preventDefault()

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")

if(!objet || !date || !natureId || !type){
    alert("Veuillez remplir les champs obligatoires")
    return
}

if (!natureId || isNaN(parseInt(natureId))) {
    alert("Veuillez sélectionner une nature valide")
    return
}

setLoading(true)

const formData = new FormData()

formData.append("numero",numero)
formData.append("annee",annee)
formData.append("type",type)
formData.append("objet",objet)
formData.append("date_courrier",date)
formData.append("description",description)
formData.append("expediteur",expediteur)
formData.append("nombre_pieces",nombrePieces)
formData.append("observations",observations)
formData.append("nature_id",natureId)

if(fichier){
    formData.append("fichier",fichier)
}

    const url = editId ? "/api/courriers/"+editId : "/api/courriers"

    fetch(url,{
        method:"POST",
        headers: {
            "Accept": "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body:formData
    })
    .then(async res => {
        const contentType = res.headers.get("content-type")
        
        if (!res.ok) {
            // Check if response is JSON before parsing
            if (contentType && contentType.includes("application/json")) {
                const err = await res.json()
                let errorMsg = 'Erreur: ';
                if (err.errors) {
                    Object.keys(err.errors).forEach(key => {
                        errorMsg += '\n- ' + key + ': ' + err.errors[key].join(', ');
                    });
                } else {
                    errorMsg += err.message || err.error || 'Erreur serveur';
                }
                throw new Error(errorMsg);
            }
            // HTML response - likely auth redirect or server error
            throw new Error(`Erreur ${res.status}: ${res.statusText}. Veuillez vous reconnecter.`);
        }
        
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Réponse invalide du serveur");
        }
        
        return res.json();
    })
    .then(data => {
        if (data && data.success) {
            alert(editId ? "Courrier modifié avec succès" : "Courrier ajouté avec succès")
            window.location.href = "/courriers"
        } else if (data && data.message) {
            throw new Error(data.message);
        }
    })
.catch((err)=>{
alert(err.message)
setLoading(false)
})

}

return(

<Sidebar>

<div style={{ padding: "30px" }}>

<div style={{
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden"
}}>

<div style={{
    background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
    padding: "25px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
}}>
    <div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "white" }}>
            {editId ? "Modifier Courrier Arrivée" : "Nouveau Courrier Arrivée"}
        </h1>
        <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.8, color: "white" }}>
            {editId ? "Mettre à jour les informations" : "Enregistrer un nouveau courrier"}
        </p>
    </div>
    <button
        onClick={() => window.location.href = "/courriers"}
        style={{
            background: "rgba(255,255,255,0.2)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.3)",
            fontWeight: "500",
            cursor: "pointer"
        }}
    >
        ← Retour à la liste
    </button>
</div>

<div style={{ padding: "30px" }}>

<form onSubmit={submitForm} style={{ display: "grid", gap: "25px" }}>

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Année</label>
<input
type="number"
value={annee}
onChange={(e)=>setAnnee(e.target.value)}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px"
}}
/>
</div>

<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Numéro</label>
<input
type="text"
value={numero}
onChange={(e)=>setNumero(e.target.value)}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#f8fafc"
}}
/>
</div>

</div>

<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
    Date d'arrivée *
</label>
<input
type="date"
value={date}
max={new Date().toISOString().split("T")[0]}
onChange={(e)=>setDate(e.target.value)}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px"
}}
/>
</div>

<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
    Objet *
</label>
<textarea
value={objet}
onChange={(e)=>setObjet(e.target.value)}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    minHeight: "80px"
}}
/>
</div>

<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
    Type de courrier *
</label>

<select
value={type}
onChange={(e)=>setType(e.target.value)}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px"
}}
>

<option value="Facture">Facture</option>
<option value="Note">Note</option>
<option value="Réclamation">Réclamation</option>
<option value="Officiel">Officiel</option>

</select>
</div>

<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
    Nature *
</label>

<select
value={natureId}
onChange={(e)=>setNatureId(e.target.value)}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px"
}}
>

<option value="">Choisir nature</option>

{natures.map(n=>(
<option key={n.id} value={n.id}>
{n.nom}
</option>
))}

</select>

</div>

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Nombre de pièces</label>
<input
type="number"
value={nombrePieces}
onChange={(e)=>setNombrePieces(e.target.value)}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px"
}}
/>
</div>
<br />
<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Expéditeur</label>
<input
type="text"
value={expediteur}
onChange={(e)=>setExpediteur(e.target.value)}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px"
}}
/>
</div>

</div>

<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Description</label>
<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    minHeight: "80px"
}}
/>
</div>

<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Observations</label>
<textarea
value={observations}
onChange={(e)=>setObservations(e.target.value)}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    minHeight: "80px"
}}
/>
</div>

<div>
<label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
    Scan courrier (PDF)
</label>

<input
type="file"
accept="application/pdf"
onChange={(e)=>setFichier(e.target.files[0])}
style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px"
}}
/>

</div>

<button
type="submit"
disabled={loading}
style={{
    background: loading ? "#9ca3af" : "#22c55e",
    color: "white",
    padding: "15px 30px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "10px"
}}
>

{loading ? "Enregistrement..." : editId ? "Modifier le courrier" : "Enregistrer le courrier"}

</button>

</form>

</div>

</div>

</div>

</Sidebar>

)

}