import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";

export default function CreateCourrierDepart() {
  const [numero, setNumero] = useState("");
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [objet, setObjet] = useState("");
  const [type, setType] = useState("");
  const [dateDepart, setDateDepart] = useState("");
  const [destinataire, setDestinataire] = useState("");
  const [modeEnvoi, setModeEnvoi] = useState("");
  const [description, setDescription] = useState("");
  const [nombrePieces, setNombrePieces] = useState("");
  const [observations, setObservations] = useState("");
  const [natureId, setNatureId] = useState("");
  const [natures, setNatures] = useState([]);
  const [courrierArriveId, setCourrierArriveId] = useState("");
  const [courriers, setCourriers] = useState([]);
  const [fichier, setFichier] = useState(null);
  const [existingFile, setExistingFile] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");
  const isEdit = !!id;

  useEffect(() => {
    fetch("/api/natures")
      .then((res) => res.json())
      .then((data) => setNatures(data));

    fetch("/api/courriers")
      .then((res) => res.json())
      .then((data) => setCourriers(data));
  }, []);

  useEffect(() => {
    if (!isEdit) {
      fetch("/api/courrier-departs/next-number?annee=" + annee)
        .then((res) => res.json())
        .then((data) => {
          setNumero(data.numero);
        });
    }
  }, [annee, isEdit]);

  useEffect(() => {
    if (isEdit && id) {
      fetch(`/api/courrier-departs/${id}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Erreur lors du chargement du courrier");
          }
          return res.json();
        })
        .then((data) => {
          setNumero(data.numero || "");
          setAnnee(data.annee || new Date().getFullYear());
          setObjet(data.objet || "");
          setType(data.type || "");
          setDateDepart(data.date_depart || "");
          setDestinataire(data.destinataire_externe || "");
          setModeEnvoi(data.mode_envoi || "");
          setDescription(data.description || "");
          setNombrePieces(data.nombre_pieces || "");
          setObservations(data.observations || "");
          setNatureId(data.nature_id || "");
          setCourrierArriveId(data.courrier_arrive_id || "");
          setExistingFile(data.fichier || "");
        })
        .catch((err) => {
          console.error(err);
          alert("Erreur lors du chargement du courrier");
        });
    }
  }, [id, isEdit]);

  const submitForm = (e) => {
    e.preventDefault();

    if (!objet || !dateDepart || !destinataire || !modeEnvoi || !natureId) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("numero", numero);
    formData.append("annee", annee);
    formData.append("type", type);
    formData.append("objet", objet);
    formData.append("date_depart", dateDepart);
    formData.append("destinataire_externe", destinataire);
    formData.append("mode_envoi", modeEnvoi);
    formData.append("description", description);
    formData.append("nombre_pieces", nombrePieces);
    formData.append("observations", observations);
    formData.append("nature_id", natureId);
    formData.append("courrier_arrive_id", courrierArriveId);

    if (fichier) {
      formData.append("fichier", fichier);
    }

    const url = isEdit
      ? `/api/courrier-departs/${id}`
      : "/api/courrier-departs";

    if (isEdit) {
      formData.append("_method", "PUT");
    }

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Erreur");
        }
        return data;
      })
      .then(() => {
        alert(
          isEdit
            ? "Courrier départ modifié avec succès"
            : "Courrier départ ajouté avec succès"
        );
        router.visit("/courrier-departs");
      })
      .catch((err) => {
        console.error(err);
        alert(
          isEdit
            ? "Erreur lors de la modification"
            : "Erreur lors de l'ajout"
        );
        setLoading(false);
      });
  };

  return (
    <Sidebar>
      <div style={{ padding: "30px" }}>

        <div style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden"
        }}>

            <div style={{
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                padding: "25px 30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "white" }}>
                        {isEdit ? "Modifier Courrier Départ" : "Nouveau Courrier Départ"}
                    </h1>
                    <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.8, color: "white" }}>
                        {isEdit ? "Mettre à jour les informations" : "Enregistrer un nouveau courrier"}
                    </p>
                </div>
                <button
                    onClick={() => router.visit("/courrier-departs")}
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
                                onChange={(e) => setAnnee(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }}
                                disabled={isEdit}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Numéro</label>
                            <input
                                type="text"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    background: "#f8fafc"
                                }}
                                disabled={isEdit}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Date de départ *</label>
                        <input
                            type="date"
                            value={dateDepart}
                            max={today}
                            onChange={(e) => setDateDepart(e.target.value)}
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
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Objet *</label>
                        <input
                            type="text"
                            value={objet}
                            onChange={(e) => setObjet(e.target.value)}
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
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Type de courrier</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                fontSize: "14px"
                            }}
                        >
                            <option value="">Choisir type</option>
                            <option value="Facture">Facture</option>
                            <option value="Note">Note</option>
                            <option value="Réclamation">Réclamation</option>
                            <option value="Officiel">Officiel</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Destinataire externe *</label>
                        <input
                            type="text"
                            value={destinataire}
                            onChange={(e) => setDestinataire(e.target.value)}
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
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Mode d'envoi *</label>
                        <select
                            value={modeEnvoi}
                            onChange={(e) => setModeEnvoi(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                fontSize: "14px"
                            }}
                        >
                            <option value="">Choisir</option>
                            <option value="Poste">Poste</option>
                            <option value="Email">Email</option>
                            <option value="Remise en main propre">Remise en main propre</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Nature *</label>
                        <select
                            value={natureId}
                            onChange={(e) => setNatureId(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                fontSize: "14px"
                            }}
                        >
                            <option value="">Choisir nature</option>
                            {natures.map((n) => (
                                <option key={n.id} value={n.id}>
                                    {n.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Réponse à (courrier arrivé)</label>
                        <select
                            value={courrierArriveId}
                            onChange={(e) => setCourrierArriveId(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                fontSize: "14px"
                            }}
                        >
                            <option value="">Pas de réponse</option>
                            {courriers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.numero} - {c.objet}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Nombre de pièces</label>
                        <input
                            type="number"
                            value={nombrePieces}
                            onChange={(e) => setNombrePieces(e.target.value)}
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
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                            onChange={(e) => setObservations(e.target.value)}
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
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Scan courrier (PDF)</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFichier(e.target.files[0])}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                fontSize: "14px"
                            }}
                        />
                        {existingFile && !fichier && (
                            <p style={{ fontSize: "13px", color: "#22c55e", marginTop: "8px" }}>
                                ✓ Fichier actuel déjà enregistré
                            </p>
                        )}
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
                        {loading
                            ? isEdit
                                ? "Modification..."
                                : "Enregistrement..."
                            : isEdit
                            ? "Modifier"
                            : "Enregistrer"}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </Sidebar>
  );
}