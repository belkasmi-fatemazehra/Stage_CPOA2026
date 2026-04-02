import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";

export default function ListCourriers() {

const [courriers, setCourriers] = useState([]);
const [search, setSearch] = useState("");
const [annee, setAnnee] = useState("");
const [currentUser, setCurrentUser] = useState(null);

const [showModal, setShowModal] = useState(false);
const [selectedCourrier, setSelectedCourrier] = useState(null);
const [services, setServices] = useState([]);
const [selectedServices, setSelectedServices] = useState([]);
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
    loadCourriers();
    fetch("/api/me", { credentials: "include" })
        .then(res => {
            if (res.ok) return res.json();
            return null;
        })
        .then(data => setCurrentUser(data))
        .catch(() => setCurrentUser(null));
}, []);

useEffect(() => {
    fetch("/api/services", { credentials: "include" })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setServices(data);
            }
        })
        .catch(err => console.error("Erreur chargement services:", err));
}, []);

const loadCourriers = () => {
    fetch("/api/courriers", { credentials: "include" })
        .then(res => res.json())
        .then(data => {
            setCourriers(Array.isArray(data) ? data : []);
        })
        .catch(err => {
            console.error("Erreur chargement courriers:", err);
            setCourriers([]);
        });
};

const filtered = courriers.filter(c => {
    const numero = c.numero ? c.numero.toLowerCase() : "";
    const objet = c.objet ? c.objet.toLowerCase() : "";
    const s = search.toLowerCase();
    return numero.includes(s) || objet.includes(s);
});

const deleteCourrier = (id) => {
    if (!confirm("Supprimer ce courrier ?")) return;
    fetch(`/api/courriers/${id}`, {
        method: "DELETE"
    })
    .then(() => loadCourriers());
};

const voirCourrier = (c) => {
    if (c.fichier) {
        window.open('/courriers/voir?path=' + encodeURIComponent(c.fichier), "_blank");
    }
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    fetch(`/api/courriers/${c.id}/valider`, {
        method: "PUT",
        headers: { "X-CSRF-TOKEN": csrfToken },
        credentials: "include"
    })
    .then(() => loadCourriers());
};

const telecharger = (c) => {
    window.open(`/api/courriers/download/${c.id}`, "_blank");
};

const genererPdf = () => {
    if (!annee) {
        alert("Choisir une année");
        return;
    }
    window.open(`/api/courriers/generer-pdf/${annee}`, "_blank");
};

const annees = [...new Set(courriers.map(c => c.annee))];

const openAffectation = (courrier) => {
    setSelectedCourrier(courrier);
    setSelectedServices([]);
    setMessage("");
    setShowModal(true);
};

const closeModal = () => {
    setShowModal(false);
    setSelectedCourrier(null);
    setSelectedServices([]);
    setMessage("");
};

const handleCheckbox = (id) => {
    if (selectedServices.includes(id)) {
        setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
        if (selectedServices.length >= 2) {
            alert("Maximum 2 services autorisés");
            return;
        }
        setSelectedServices([...selectedServices, id]);
    }
};

const submitAffectation = () => {
    if (selectedServices.length === 0) {
        alert("Veuillez sélectionner au moins un service");
        return;
    }

    if (!selectedCourrier) {
        alert("Erreur: Aucun courrier sélectionné");
        return;
    }

    setLoading(true);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

    fetch("/api/affectations", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken
        },
        body: JSON.stringify({
            courrier_id: selectedCourrier.id,
            services: selectedServices,
            message: message
        })
    })
    .then(res => res.json())
    .then(data => {
        setLoading(false);
        if (data.success || data.message) {
            alert(data.message || "Affectation envoyée avec succès!");
            closeModal();
            loadCourriers();
        } else {
            alert(data.message || "Erreur lors de l'affectation");
        }
    })
    .catch(err => {
        setLoading(false);
        console.error("Erreur affectation:", err);
        alert("Erreur lors de l'envoi de l'affectation");
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
                    background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
                    padding: "25px 30px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "white" }}>
                            Liste Courrier Arrivée
                        </h1>
                        <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.8, color: "white" }}>
                            Gestion des courriers reçus
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = "/courriers/create"}
                        style={{
                            background: "white",
                            color: "#1e3a5f",
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
                            {annees.map(a => (
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
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc" }}>
                                <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>N°</th>
                                <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Année</th>
                                <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Objet</th>
                                <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Date</th>
                                <th style={{ padding: "15px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Affectation</th>
                                <th style={{ padding: "15px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Statut</th>
                                <th style={{ padding: "15px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                                        Aucun courrier trouvé
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(c => {
                                    const hasAffectation = c.affectations && c.affectations.length > 0;
                                    const affectationCount = c.affectations ? c.affectations.length : 0;

                                    return (
                                        <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "15px", fontWeight: "600", color: "#1e3a5f" }}>{c.numero}</td>
                                            <td style={{ padding: "15px", textAlign: "center", color: "#64748b" }}>{c.annee}</td>
                                            <td style={{ padding: "15px", color: "#334155" }}>{c.objet}</td>
                                            <td style={{ padding: "15px", color: "#64748b" }}>{c.date_arrivee}</td>
                                            <td style={{ padding: "15px", textAlign: "center" }}>
                                                {hasAffectation ? (
                                                    <span style={{
                                                        background: "#dcfce7",
                                                        color: "#15803d",
                                                        padding: "4px 12px",
                                                        borderRadius: "20px",
                                                        fontSize: "12px",
                                                        fontWeight: "500"
                                                    }}>
                                                        ✓ {affectationCount} service(s)
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        background: "#fef3c7",
                                                        color: "#b45309",
                                                        padding: "4px 12px",
                                                        borderRadius: "20px",
                                                        fontSize: "12px",
                                                        fontWeight: "500"
                                                    }}>
                                                        Non Affecté
                                                    </span>
                                                )}
                                            </td>
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
                                                    <button onClick={() => voirCourrier(c)} style={actionBtnStyle("#3b82f6")} title="Voir">👁️</button>
                                                    <button onClick={() => telecharger(c)} style={actionBtnStyle("#22c55e")} title="Télécharger">⬇️</button>
                                                    <button onClick={() => router.visit(`/courriers/create?id=${c.id}`)} style={actionBtnStyle("#f97316")} title="Modifier">✏️</button>
                                                    <button onClick={() => deleteCourrier(c.id)} style={actionBtnStyle("#ef4444")} title="Supprimer">🗑️</button>
                                                    <button 
                                                        onClick={() => openAffectation(c)} 
                                                        style={hasAffectation ? actionBtnStyle("#6366f1") : actionBtnStyle("#8b5cf6")} 
                                                        title={hasAffectation ? "Modifier l'affectation" : "Affecter"}
                                                    >
                                                        {hasAffectation ? "Modifier" : "Affecter"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal d'affectation */}
            {showModal && (
                <div 
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "12px",
                        width: "500px",
                        maxWidth: "90vw"
                    }}>
                        <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: "600", color: "#1e3a5f" }}>
                            📌 Affecter le Courrier
                        </h2>

                        <div style={{ 
                            marginBottom: "20px", 
                            padding: "15px", 
                            background: "#f0f9ff", 
                            borderRadius: "8px", 
                            border: "1px solid #bae6fd" 
                        }}>
                            <p style={{ fontSize: "13px", color: "#0369a1", margin: "0" }}>
                                <strong>Courrier:</strong> N°{selectedCourrier?.numero}/{selectedCourrier?.annee}
                            </p>
                            <p style={{ fontSize: "13px", color: "#0369a1", margin: "8px 0 0 0" }}>
                                <strong>Objet:</strong> {selectedCourrier?.objet}
                            </p>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "10px" }}>
                                Sélectionner 1 ou 2 services :
                            </label>
                            {services.length === 0 ? (
                                <p style={{ color: "#94a3b8", fontSize: "13px" }}>Chargement des services...</p>
                            ) : (
                                services.map(s => (
                                    <div key={s.id} style={{ marginBottom: "10px" }}>
                                        <label style={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            gap: "10px", 
                                            cursor: "pointer",
                                            padding: "10px",
                                            borderRadius: "6px",
                                            background: selectedServices.includes(s.id) ? "#eff6ff" : "transparent",
                                            border: selectedServices.includes(s.id) ? "1px solid #3b82f6" : "1px solid #e2e8f0"
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedServices.includes(s.id)}
                                                onChange={() => handleCheckbox(s.id)}
                                                style={{ width: "18px", height: "18px", cursor: "pointer" }}
                                            />
                                            <span style={{ fontSize: "14px", color: "#334155" }}>{s.nom_service}</span>
                                        </label>
                                    </div>
                                ))
                            )}
                            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
                                Services sélectionnés: {selectedServices.length}/2
                            </p>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                                Message (optionnel) :
                            </label>
                            <textarea
                                placeholder="Écrire un message pour le service..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    resize: "vertical"
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button
                                onClick={closeModal}
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
                                disabled={loading || selectedServices.length === 0}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    border: "none",
                                    background: (loading || selectedServices.length === 0) ? "#9ca3af" : "#22c55e",
                                    color: "white",
                                    cursor: (loading || selectedServices.length === 0) ? "not-allowed" : "pointer",
                                    fontWeight: "500"
                                }}
                            >
                                {loading ? "Envoi en cours..." : "✅ Affecter"}
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
    fontSize: "14px",
    textDecoration: "none",
    display: "inline-block"
});
