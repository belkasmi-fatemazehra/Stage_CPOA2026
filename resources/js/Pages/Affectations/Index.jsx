import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";

export default function Index() {
    const [affectations, setAffectations] = useState([]);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetch("/api/me", { credentials: "include" })
            .then(res => {
                if (res.ok) return res.json();
                return null;
            })
            .then(data => setCurrentUser(data))
            .catch(() => setCurrentUser(null));

        fetchAffectations();
    }, []);

    const fetchAffectations = () => {
        setLoading(true);
        fetch("/api/affectations/list", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setAffectations(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setAffectations([]);
                setLoading(false);
            });
    };

    const handleResponseChange = (id, value) => {
        setResponses({ ...responses, [id]: value });
    };

    const handleSubmitResponse = (affectationId) => {
        const message = responses[affectationId] || "";
        if (!message.trim()) {
            alert("Veuillez entrer une réponse");
            return;
        }
        
        fetch(`/api/affectations/${affectationId}/respond`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        })
        .then(res => res.json())
        .then(() => {
            alert("Réponse envoyée avec succès!");
            const newResponses = { ...responses };
            delete newResponses[affectationId];
            setResponses(newResponses);
            fetchAffectations();
        })
        .catch(() => alert("Erreur lors de l'envoi de la réponse"));
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
                        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                        padding: "25px 30px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "white" }}>
                                Mes Affectations
                            </h1>
                            <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.8, color: "white" }}>
                                Courriers affectés par l'administrateur
                            </p>
                        </div>
                    </div>

                    <div style={{ padding: "25px 30px" }}>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                                Chargement...
                            </div>
                        ) : affectations.length === 0 ? (
                            <div style={{ 
                                padding: "40px", 
                                background: "#f8fafc", 
                                borderRadius: "12px", 
                                textAlign: "center",
                                color: "#94a3b8"
                            }}>
                                📭 Aucune affectation pour le moment
                            </div>
                        ) : (
                            <div style={{ display: "grid", gap: "20px" }}>
                                {affectations.map((affectation) => (
                                    <div key={affectation.id} style={{
                                        background: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "12px",
                                        padding: "20px"
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <span style={{
                                                        background: "#1e3a5f",
                                                        color: "white",
                                                        padding: "4px 12px",
                                                        borderRadius: "20px",
                                                        fontSize: "13px",
                                                        fontWeight: "600"
                                                    }}>
                                                        #{affectation.courrier?.numero}/{affectation.courrier?.annee}
                                                    </span>
                                                    <span style={{ color: "#64748b", fontSize: "13px" }}>
                                                        {new Date(affectation.date_affectation).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                                <p style={{ margin: "10px 0 0 0", fontSize: "15px", color: "#334155", fontWeight: "500" }}>
                                                    {affectation.courrier?.objet}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: "15px" }}>
                                            <p style={{ 
                                                fontSize: "12px", 
                                                color: "#64748b", 
                                                marginBottom: "8px",
                                                textTransform: "uppercase",
                                                fontWeight: "600"
                                            }}>
                                                Message de l'administrateur :
                                            </p>
                                            <div style={{ 
                                                padding: "12px 15px", 
                                                background: "#eff6ff", 
                                                borderRadius: "8px", 
                                                border: "1px solid #bfdbfe",
                                                color: "#1e40af",
                                                fontSize: "14px"
                                            }}>
                                                {affectation.message || "Aucun message"}
                                            </div>
                                        </div>

                                        {affectation.reponses && affectation.reponses.length > 0 ? (
                                            <div>
                                                <p style={{ 
                                                    fontSize: "12px", 
                                                    color: "#64748b", 
                                                    marginBottom: "8px",
                                                    textTransform: "uppercase",
                                                    fontWeight: "600"
                                                }}>
                                                    Vos réponses :
                                                </p>
                                                {affectation.reponses.map((reponse) => (
                                                    <div key={reponse.id} style={{ 
                                                        padding: "12px 15px", 
                                                        background: "#dcfce7", 
                                                        borderRadius: "8px", 
                                                        border: "1px solid #bbf7d0",
                                                        color: "#15803d",
                                                        fontSize: "14px"
                                                    }}>
                                                        {reponse.message}
                                                    </div>
                                                ))}
                                                <div style={{ 
                                                    marginTop: "10px",
                                                    color: "#22c55e",
                                                    fontSize: "13px",
                                                    fontWeight: "500"
                                                }}>
                                                    ✓ Déjà répondu
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={responses[affectation.id] || ""}
                                                    onChange={(e) => handleResponseChange(affectation.id, e.target.value)}
                                                    placeholder="Entrez votre réponse..."
                                                    style={{ 
                                                        width: "100%", 
                                                        padding: "12px 15px", 
                                                        border: "1px solid #e2e8f0", 
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        marginBottom: "10px"
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleSubmitResponse(affectation.id)}
                                                    style={{ 
                                                        padding: "10px 20px", 
                                                        background: "#2563eb", 
                                                        color: "white", 
                                                        border: "none", 
                                                        borderRadius: "8px", 
                                                        cursor: "pointer",
                                                        fontSize: "14px",
                                                        fontWeight: "500"
                                                    }}
                                                >
                                                    📤 Répondre
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}