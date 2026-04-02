import { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";

export default function Index() {
    const [affectations, setAffectations] = useState([]);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [submitting, setSubmitting] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetch("/api/me", { credentials: "include" })
            .then(res => {
                if (res.ok) return res.json();
                return null;
            })
            .then(data => {
                setCurrentUser(data);
                fetchAffectations(data);
            })
            .catch(err => {
                console.error("Erreur auth:", err);
                setLoading(false);
            });
    }, []);

    const fetchAffectations = (user) => {
        setLoading(true);
        fetch("/api/affectations/list", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                let filteredData = Array.isArray(data) ? data : [];
                setAffectations(filteredData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement affectations:", err);
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
        
        setSubmitting(affectationId);
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
        
        fetch(`/api/affectations/${affectationId}/respond`, {
            method: "POST",
            credentials: "include",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            },
            body: JSON.stringify({ message: message })
        })
        .then(res => res.json())
        .then(data => {
            setSubmitting(null);
            if (data.success || data.message) {
                alert(data.message || "Réponse envoyée avec succès!");
                const newResponses = { ...responses };
                delete newResponses[affectationId];
                setResponses(newResponses);
                fetchAffectations(currentUser);
            } else {
                alert(data.message || "Erreur lors de l'envoi de la réponse");
            }
        })
        .catch(err => {
            setSubmitting(null);
            console.error("Erreur réponse:", err);
            alert("Erreur lors de l'envoi de la réponse");
        });
    };

    const filteredAffectations = affectations.filter(affectation => {
        const hasResponded = affectation.reponses && affectation.reponses.length > 0;
        
        const matchesSearch = !searchTerm || 
            affectation.courrier?.objet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affectation.courrier?.numero?.toString().includes(searchTerm) ||
            affectation.courrier?.expediteur?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === "all" || 
            (filterStatus === "pending" && !hasResponded) ||
            (filterStatus === "responded" && hasResponded);
        
        return matchesSearch && matchesStatus;
    });

    const respondedCount = affectations.filter(a => a.reponses && a.reponses.length > 0).length;
    const pendingCount = affectations.length - respondedCount;

    const getStatusBadge = (hasResponded) => {
        if (hasResponded) {
            return {
                bg: "#dcfce7",
                text: "#15803d",
                border: "#bbf7d0",
                icon: "✓",
                label: "Répondu"
            };
        }
        return {
            bg: "#fef3c7",
            text: "#b45309",
            border: "#fde68a",
            icon: "⏳",
            label: "En attente"
        };
    };

    return (
        <Sidebar>
            <div style={{ padding: "30px" }}>
                <div style={{
                    background: "white",
                    borderRadius: "16px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden"
                }}>
                    {/* Header */}
                    <div style={{
                        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                        padding: "30px 35px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "20px"
                    }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "white", display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontSize: "32px" }}>📌</span>
                                Mes Affectations
                            </h1>
                            <p style={{ margin: "8px 0 0 0", fontSize: "15px", opacity: 0.9, color: "white" }}>
                                {currentUser ? `Bienvenue, ${currentUser.name}` : "Chargement..."}
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: "15px" }}>
                            <div style={{ 
                                background: "rgba(255,255,255,0.15)", 
                                padding: "12px 20px", 
                                borderRadius: "10px",
                                textAlign: "center"
                            }}>
                                <div style={{ color: "white", fontSize: "24px", fontWeight: "700" }}>{affectations.length}</div>
                                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>Total</div>
                            </div>
                            <div style={{ 
                                background: "rgba(34,197,94,0.2)", 
                                padding: "12px 20px", 
                                borderRadius: "10px",
                                textAlign: "center"
                            }}>
                                <div style={{ color: "#86efac", fontSize: "24px", fontWeight: "700" }}>{respondedCount}</div>
                                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>Répondues</div>
                            </div>
                            <div style={{ 
                                background: "rgba(251,191,36,0.2)", 
                                padding: "12px 20px", 
                                borderRadius: "10px",
                                textAlign: "center"
                            }}>
                                <div style={{ color: "#fde68a", fontSize: "24px", fontWeight: "700" }}>{pendingCount}</div>
                                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>En attente</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={{ 
                        padding: "20px 35px", 
                        borderBottom: "1px solid #e2e8f0",
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                        alignItems: "center"
                    }}>
                        <div style={{ flex: "1", minWidth: "250px" }}>
                            <input
                                type="text"
                                placeholder="🔍 Rechercher par objet, numéro ou expéditeur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "10px",
                                    fontSize: "14px",
                                    outline: "none"
                                }}
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                padding: "12px 16px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "10px",
                                fontSize: "14px",
                                outline: "none",
                                background: "white",
                                cursor: "pointer",
                                minWidth: "180px"
                            }}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="pending">En attente</option>
                            <option value="responded">Répondues</option>
                        </select>
                        <button
                            onClick={() => fetchAffectations(currentUser)}
                            style={{
                                padding: "12px 16px",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                            }}
                        >
                            🔄
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "25px 35px" }}>
                        {loading ? (
                            <div style={{ 
                                textAlign: "center", 
                                padding: "60px", 
                                color: "#94a3b8",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "15px"
                            }}>
                                <div style={{ 
                                    width: "50px", 
                                    height: "50px", 
                                    border: "3px solid #e2e8f0",
                                    borderTop: "3px solid #a855f7",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite"
                                }}></div>
                                <p>Chargement des affectations...</p>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : filteredAffectations.length === 0 ? (
                            <div style={{ 
                                padding: "60px", 
                                background: "#f8fafc", 
                                borderRadius: "16px", 
                                textAlign: "center",
                                border: "2px dashed #e2e8f0"
                            }}>
                                <div style={{ fontSize: "48px", marginBottom: "15px" }}>📭</div>
                                <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>
                                    {searchTerm || filterStatus !== "all" 
                                        ? "Aucune affectation ne correspond à votre recherche" 
                                        : "Aucune affectation pour votre service"}
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {filteredAffectations.map((affectation) => {
                                    const hasResponded = affectation.reponses && affectation.reponses.length > 0;
                                    const status = getStatusBadge(hasResponded);
                                    
                                    return (
                                        <div key={affectation.id} style={{
                                            background: "white",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "16px",
                                            overflow: "hidden",
                                            transition: "all 0.2s",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                                        }}>
                                            {/* Card Header */}
                                            <div style={{ 
                                                background: "#f8fafc",
                                                padding: "18px 25px",
                                                borderBottom: "1px solid #e2e8f0",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                                gap: "15px"
                                            }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                                                    <span style={{
                                                        background: "#1e3a5f",
                                                        color: "white",
                                                        padding: "8px 16px",
                                                        borderRadius: "25px",
                                                        fontSize: "14px",
                                                        fontWeight: "600",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px"
                                                    }}>
                                                        📄 N°{affectation.courrier?.numero}/{affectation.courrier?.annee}
                                                    </span>
                                                    <span style={{
                                                        background: "#f0f9ff",
                                                        color: "#0369a1",
                                                        padding: "6px 14px",
                                                        borderRadius: "25px",
                                                        fontSize: "13px",
                                                        fontWeight: "500"
                                                    }}>
                                                        🏢 {affectation.service?.nom_service}
                                                    </span>
                                                    <span style={{
                                                        background: status.bg,
                                                        color: status.text,
                                                        padding: "6px 14px",
                                                        borderRadius: "25px",
                                                        fontSize: "13px",
                                                        fontWeight: "500",
                                                        border: `1px solid ${status.border}`
                                                    }}>
                                                        {status.icon} {status.label}
                                                    </span>
                                                </div>
                                                <div style={{ 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    gap: "10px",
                                                    color: "#94a3b8",
                                                    fontSize: "13px"
                                                }}>
                                                    <span>📅 {new Date(affectation.date_affectation).toLocaleDateString('fr-FR', { 
                                                        day: 'numeric', 
                                                        month: 'long', 
                                                        year: 'numeric' 
                                                    })}</span>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div style={{ padding: "25px" }}>
                                                {/* Objet et expéditeur */}
                                                <div style={{ marginBottom: "20px" }}>
                                                    <p style={{ 
                                                        fontSize: "12px", 
                                                        color: "#64748b", 
                                                        marginBottom: "6px",
                                                        textTransform: "uppercase",
                                                        fontWeight: "600",
                                                        letterSpacing: "0.5px"
                                                    }}>
                                                        Objet du courrier
                                                    </p>
                                                    <h3 style={{ 
                                                        color: "#1e293b", 
                                                        fontSize: "17px", 
                                                        margin: "0 0 12px 0",
                                                        fontWeight: "600",
                                                        lineHeight: "1.5"
                                                    }}>
                                                        {affectation.courrier?.objet || "Sans objet"}
                                                    </h3>
                                                    {affectation.courrier?.expediteur && (
                                                        <p style={{ 
                                                            color: "#64748b", 
                                                            fontSize: "14px", 
                                                            margin: 0,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "6px"
                                                        }}>
                                                            <span>👤</span>
                                                            <strong>Expéditeur:</strong> {affectation.courrier.expediteur}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Message de l'admin */}
                                                <div style={{ marginBottom: "20px" }}>
                                                    <p style={{ 
                                                        fontSize: "12px", 
                                                        color: "#0369a1", 
                                                        marginBottom: "8px",
                                                        textTransform: "uppercase",
                                                        fontWeight: "600",
                                                        letterSpacing: "0.5px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px"
                                                    }}>
                                                        💡 Instruction de l'administrateur
                                                    </p>
                                                    <div style={{ 
                                                        padding: "16px 20px", 
                                                        background: "#f0f9ff", 
                                                        borderRadius: "12px", 
                                                        border: "1px solid #bae6fd",
                                                        color: "#0369a1",
                                                        fontSize: "14px",
                                                        lineHeight: "1.6"
                                                    }}>
                                                        {affectation.message || "Aucun message - faire le nécessaire"}
                                                    </div>
                                                </div>

                                                {/* Bouton fichier */}
                                                {affectation.courrier?.fichier && (
                                                    <div style={{ marginBottom: "20px" }}>
                                                        <button
                                                            onClick={() => {
                                                                window.open('/courriers/voir?path=' + encodeURIComponent(affectation.courrier.fichier), "_blank");
                                                            }}
                                                            style={{
                                                                padding: "10px 18px",
                                                                background: "#3b82f6",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "8px",
                                                                cursor: "pointer",
                                                                fontSize: "13px",
                                                                fontWeight: "500",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "6px"
                                                            }}
                                                        >
                                                            📄 Voir le courrier
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Réponses précédentes ou formulaire */}
                                                {hasResponded ? (
                                                    <div style={{
                                                        padding: "20px",
                                                        background: "#f0fdf4",
                                                        borderRadius: "12px",
                                                        border: "1px solid #bbf7d0"
                                                    }}>
                                                        <p style={{ 
                                                            fontSize: "12px", 
                                                            color: "#15803d", 
                                                            marginBottom: "12px",
                                                            textTransform: "uppercase",
                                                            fontWeight: "600",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "6px"
                                                        }}>
                                                            ✅ Vos réponses précédentes
                                                        </p>
                                                        {affectation.reponses.map((reponse, idx) => (
                                                            <div key={reponse.id} style={{ 
                                                                marginBottom: idx < affectation.reponses.length - 1 ? "12px" : "0",
                                                                padding: "14px",
                                                                background: "#dcfce7",
                                                                borderRadius: "10px"
                                                            }}>
                                                                <p style={{ color: "#166534", fontSize: "14px", margin: "0 0 8px 0", lineHeight: "1.5" }}>
                                                                    {reponse.message}
                                                                </p>
                                                                <p style={{ color: "#15803d", fontSize: "12px", margin: 0 }}>
                                                                    📅 {new Date(reponse.created_at).toLocaleDateString('fr-FR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        ))}
                                                        <div style={{ 
                                                            marginTop: "12px",
                                                            color: "#15803d",
                                                            fontSize: "14px",
                                                            fontWeight: "600",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "6px"
                                                        }}>
                                                            ✓ Toutes vos réponses ont été envoyées
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        background: "#fefce8",
                                                        padding: "20px",
                                                        borderRadius: "12px",
                                                        border: "1px solid #fef08a"
                                                    }}>
                                                        <label style={{ 
                                                            display: "block", 
                                                            fontSize: "13px", 
                                                            color: "#a16207", 
                                                            marginBottom: "10px",
                                                            fontWeight: "600"
                                                        }}>
                                                            ✍️ Votre réponse :
                                                        </label>
                                                        <textarea
                                                            value={responses[affectation.id] || ""}
                                                            onChange={(e) => handleResponseChange(affectation.id, e.target.value)}
                                                            placeholder="Entrez votre réponse ici... Expliquez les actions menées ou le statut de traitement..."
                                                            rows={4}
                                                            style={{ 
                                                                width: "100%", 
                                                                padding: "14px 16px", 
                                                                border: "1px solid #fde68a", 
                                                                borderRadius: "10px",
                                                                fontSize: "14px",
                                                                marginBottom: "14px",
                                                                resize: "vertical",
                                                                fontFamily: "inherit",
                                                                background: "white"
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => handleSubmitResponse(affectation.id)}
                                                            disabled={submitting === affectation.id}
                                                            style={{ 
                                                                padding: "14px 28px", 
                                                                background: submitting === affectation.id ? "#9ca3af" : "#22c55e", 
                                                                color: "white", 
                                                                border: "none", 
                                                                borderRadius: "10px", 
                                                                cursor: submitting === affectation.id ? "not-allowed" : "pointer",
                                                                fontSize: "14px",
                                                                fontWeight: "600",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px"
                                                            }}
                                                        >
                                                            {submitting === affectation.id ? (
                                                                <>⏳ Envoi en cours...</>
                                                            ) : (
                                                                <>📤 Envoyer la réponse</>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}