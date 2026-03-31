import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";

export default function ListCourrierDeparts() {
  const [courriers, setCourriers] = useState([]);
  const [search, setSearch] = useState("");
  const [annee, setAnnee] = useState("");
  const [importFile, setImportFile] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedCourrier, setSelectedCourrier] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCourriers();
  }, []);

  useEffect(() => {
    fetch("/api/services", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  const loadCourriers = () => {
    fetch("/api/courrier-departs", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setCourriers(Array.isArray(data) ? data : []);
      })
      .catch(() => setCourriers([]));
  };

  const filtered = courriers.filter((c) => {
    const numero = c.numero ? c.numero.toLowerCase() : "";
    const objet = c.objet ? c.objet.toLowerCase() : "";
    const destinataire = c.destinataire_externe
      ? c.destinataire_externe.toLowerCase()
      : "";
    const s = search.toLowerCase();

    return (
      numero.includes(s) ||
      objet.includes(s) ||
      destinataire.includes(s)
    );
  });

  const deleteCourrier = (id) => {
    if (!confirm("Supprimer ce courrier départ ?")) return;

    fetch(`/api/courrier-departs/${id}`, {
      method: "DELETE",
    }).then(() => loadCourriers());
  };

  const voirCourrier = (c) => {
    if (c.fichier) {
      window.open(`/storage/${c.fichier}`, "_blank");
    }

    fetch(`/api/courrier-departs/${c.id}/valider`, {
      method: "PUT",
    }).then(() => loadCourriers());
  };

  const telecharger = (c) => {
    window.open(`/api/courrier-departs/download/${c.id}`, "_blank");
  };

  const genererPdf = () => {
    if (!annee) {
      alert("Choisir une année");
      return;
    }
    window.open(`/api/courrier-departs/generer-pdf/${annee}`, "_blank");
  };

  const handleImport = () => {
    if (!importFile) {
      alert("Sélectionnez un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    fetch("/api/courrier-departs/import-excel", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Import réussi");
        loadCourriers();
      })
      .catch(() => alert("Erreur lors de l'import"));
  };

  const annees = [...new Set(courriers.map((c) => c.annee))];

  const openAffectation = (courrier) => {
    setSelectedCourrier(courrier);
    setShowModal(true);
  };

  const handleCheckbox = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const submitAffectation = () => {
    fetch("/api/affectations", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courrier_id: selectedCourrier.id,
        services: selectedServices,
        message: message,
      }),
    }).then(() => {
      alert("Affectation envoyée");
      setShowModal(false);
      setSelectedServices([]);
      setMessage("");
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
                        Liste Courrier Départ
                    </h1>
                    <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.8, color: "white" }}>
                        Gestion des courriers envoyés
                    </p>
                </div>
                <button
                    onClick={()=>router.visit("/courrier-departs/create")}
                    style={{
                        background: "white",
                        color: "#059669",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        border: "none",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                    }}
                >
                    ➕ Nouveau Courrier
                </button>
            </div>

            <div style={{ padding: "20px 30px" }}>

                <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>

                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: "10px 15px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            width: "250px",
                            fontSize: "14px"
                        }}
                    />

                    <select
                        value={annee}
                        onChange={(e) => setAnnee(e.target.value)}
                        style={{
                            padding: "10px 15px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            minWidth: "120px"
                        }}
                    >
                        <option value="">Toutes les années</option>
                        {annees.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>

                    <button
                        onClick={genererPdf}
                        style={{
                            background: "#dc2626",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            border: "none",
                            fontWeight: "500",
                            cursor: "pointer"
                        }}
                    >
                        📄 Générer PDF
                    </button>

                    <button
                        onClick={() => window.open("/courrier-departs/export-excel", "_blank")}
                        style={{
                            background: "#22c55e",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            border: "none",
                            fontWeight: "500",
                            cursor: "pointer"
                        }}
                    >
                        📊 Exporter Excel
                    </button>

                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setImportFile(e.target.files[0])}
                        style={{
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "14px"
                        }}
                    />

                    <button
                        onClick={handleImport}
                        style={{
                            background: "#f97316",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            border: "none",
                            fontWeight: "500",
                            cursor: "pointer"
                        }}
                    >
                        📥 Importer
                    </button>

                </div>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>

                    <thead>
                        <tr style={{ background: "#f8fafc" }}>
                            <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>N°</th>
                            <th style={{ padding: "15px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Année</th>
                            <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Objet</th>
                            <th style={{ padding: "15px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Date</th>
                            <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Destinataire</th>
                            <th style={{ padding: "15px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Statut</th>
                            <th style={{ padding: "15px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                                    Aucun courrier départ trouvé
                                </td>
                            </tr>
                        ) : (
                            filtered.map((c) => (
                                <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "15px", fontWeight: "600", color: "#059669" }}>{c.numero}</td>
                                    <td style={{ padding: "15px", textAlign: "center", color: "#64748b" }}>{c.annee}</td>
                                    <td style={{ padding: "15px", color: "#334155" }}>{c.objet}</td>
                                    <td style={{ padding: "15px", textAlign: "center", color: "#64748b" }}>{c.date_depart}</td>
                                    <td style={{ padding: "15px", color: "#334155" }}>{c.destinataire_externe || "-"}</td>

                                    <td style={{ padding: "15px", textAlign: "center" }}>
                                        <span style={{
                                            padding: "6px 12px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            background: c.status_id == 1 ? "#fef3c7" : "#dcfce7",
                                            color: c.status_id == 1 ? "#b45309" : "#15803d"
                                        }}>
                                            {c.status_id == 1 ? "Brouillon" : "Validé"}
                                        </span>
                                    </td>

                                    <td style={{ padding: "15px", textAlign: "center" }}>
                                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                            <button onClick={() => voirCourrier(c)} style={actionBtnStyle("#3b82f6")}>👁️</button>
                                            <button onClick={() => telecharger(c)} style={actionBtnStyle("#22c55e")}>⬇️</button>
                                            <button onClick={() => router.visit(`/courrier-departs/create?id=${c.id}`)} style={actionBtnStyle("#f97316")}>✏️</button>
                                            <button onClick={() => deleteCourrier(c.id)} style={actionBtnStyle("#ef4444")}>🗑️</button>
                                            <button onClick={() => openAffectation(c)} style={actionBtnStyle("#8b5cf6")}>📌</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

            </div>

        </div>

        {showModal && (
            <div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}>
                <div style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    width: "450px"
                }}>
                    <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: "600", color: "#1e3a5f" }}>
                        📌 Affectation du Courrier
                    </h2>

                    <div style={{ marginBottom: "20px" }}>
                        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "10px" }}>Sélectionner les services :</p>
                        {services.map(s => (
                            <div key={s.id} style={{ marginBottom: "8px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                    <input type="checkbox" onChange={() => handleCheckbox(s.id)} style={{ width: "18px", height: "18px" }} />
                                    <span style={{ fontSize: "14px" }}>{s.nom_service}</span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>Message :</label>
                        <textarea
                            placeholder="Message pour le service..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                minHeight: "100px",
                                fontSize: "14px"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#94a3b8",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "500"
                            }}
                        >
                            Annuler
                        </button>
                        <button
                            onClick={submitAffectation}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#2563eb",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "500"
                            }}
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </Sidebar>
  );
}

const actionBtnStyle = (color) => ({
    background: "transparent",
    border: `1px solid ${color}`,
    color: color,
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px"
});