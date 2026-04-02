import { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";

export default function Responses() {
    const [reponses, setReponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterService, setFilterService] = useState("all");
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch("/api/me", { credentials: "include" })
            .then(res => {
                if (res.ok) return res.json();
                return null;
            })
            .then(() => {
                fetchServices();
                fetchReponses();
            })
            .catch(err => {
                console.error("Erreur auth:", err);
                setLoading(false);
            });
    }, []);

    const fetchServices = () => {
        fetch("/api/services", { credentials: "include" })
            .then(res => res.json())
            .then(data => setServices(Array.isArray(data) ? data : []))
            .catch(() => setServices([]));
    };

    const fetchReponses = () => {
        setLoading(true);
        fetch("/api/reponses/list", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setReponses(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement réponses:", err);
                setReponses([]);
                setLoading(false);
            });
    };

    const filteredReponses = reponses.filter(reponse => {
        const matchesSearch = !searchTerm || 
            reponse.affectation?.courrier?.objet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reponse.affectation?.courrier?.numero?.toString().includes(searchTerm) ||
            reponse.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesService = filterService === "all" || 
            reponse.affectation?.service_id === parseInt(filterService);
        
        return matchesSearch && matchesService;
    });

    const getServiceColor = (index) => {
        const colors = [
            { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
            { bg: "#fce7f3", text: "#be185d", border: "#fbcfe8" },
            { bg: "#fef3c7", text: "#b45309", border: "#fde68a" },
            { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
            { bg: "#f3e8ff", text: "#7c3aed", border: "#e9d5ff" },
            { bg: "#ffedd5", text: "#c2410c", border: "#fed7aa" },
        ];
        return colors[index % colors.length];
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
                        background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
                        padding: "30px 35px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "white", display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontSize: "32px" }}>💬</span>
                                Réponses des Services
                            </h1>
                            <p style={{ margin: "8px 0 0 0", fontSize: "15px", opacity: 0.9, color: "white" }}>
                                {reponses.length} réponse{reponses.length !== 1 ? 's' : ''} reçue{reponses.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={fetchReponses}
                            style={{
                                background: "rgba(255,255,255,0.2)",
                                border: "1px solid rgba(255,255,255,0.3)",
                                color: "white",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                        >
                            🔄 Actualiser
                        </button>
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
                                placeholder="🔍 Rechercher par objet, numéro ou utilisateur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "10px",
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "border-color 0.2s"
                                }}
                            />
                        </div>
                        <select
                            value={filterService}
                            onChange={(e) => setFilterService(e.target.value)}
                            style={{
                                padding: "12px 16px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "10px",
                                fontSize: "14px",
                                outline: "none",
                                background: "white",
                                cursor: "pointer",
                                minWidth: "200px"
                            }}
                        >
                            <option value="all">Tous les services</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.nom_service}
                                </option>
                            ))}
                        </select>
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
                                    borderTop: "3px solid #2563eb",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite"
                                }}></div>
                                <p>Chargement des réponses...</p>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : filteredReponses.length === 0 ? (
                            <div style={{ 
                                padding: "60px", 
                                background: "#f8fafc", 
                                borderRadius: "16px", 
                                textAlign: "center",
                                border: "2px dashed #e2e8f0"
                            }}>
                                <div style={{ fontSize: "48px", marginBottom: "15px" }}>📭</div>
                                <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>
                                    {searchTerm || filterService !== "all" 
                                        ? "Aucune réponse ne correspond à votre recherche" 
                                        : "Aucune réponse pour le moment"}
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {filteredReponses.map((reponse, index) => {
                                    const colorScheme = getServiceColor(index);
                                    return (
                                        <div key={reponse.id} style={{
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
                                                        📄 N°{reponse.affectation?.courrier?.numero}/{reponse.affectation?.courrier?.annee}
                                                    </span>
                                                    <span style={{
                                                        background: colorScheme.bg,
                                                        color: colorScheme.text,
                                                        padding: "6px 14px",
                                                        borderRadius: "25px",
                                                        fontSize: "13px",
                                                        fontWeight: "500",
                                                        border: `1px solid ${colorScheme.border}`
                                                    }}>
                                                        🏢 {reponse.affectation?.service?.nom_service}
                                                    </span>
                                                </div>
                                                <div style={{ 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    gap: "10px",
                                                    color: "#94a3b8",
                                                    fontSize: "13px"
                                                }}>
                                                    <span>👤 {reponse.user?.name || "Utilisateur inconnu"}</span>
                                                    <span style={{ color: "#cbd5e1" }}>|</span>
                                                    <span>📅 {new Date(reponse.created_at).toLocaleDateString('fr-FR', { 
                                                        day: 'numeric', 
                                                        month: 'long', 
                                                        year: 'numeric' 
                                                    })}</span>
                                                    <span style={{ color: "#cbd5e1" }}>|</span>
                                                    <span>🕐 {new Date(reponse.created_at).toLocaleTimeString('fr-FR', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}</span>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div style={{ padding: "25px" }}>
                                                {/* Objet du courrier */}
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
                                                    <p style={{ 
                                                        color: "#1e293b", 
                                                        fontSize: "15px", 
                                                        margin: 0,
                                                        fontWeight: "500",
                                                        lineHeight: "1.5"
                                                    }}>
                                                        {reponse.affectation?.courrier?.objet || "Sans objet"}
                                                    </p>
                                                </div>

                                                {/* Message de l'admin (si existant) */}
                                                {reponse.affectation?.message && (
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
                                                            {reponse.affectation.message}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Réponse du service */}
                                                <div>
                                                    <p style={{ 
                                                        fontSize: "12px", 
                                                        color: "#15803d", 
                                                        marginBottom: "10px",
                                                        textTransform: "uppercase",
                                                        fontWeight: "600",
                                                        letterSpacing: "0.5px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px"
                                                    }}>
                                                        ✅ Réponse du service
                                                    </p>
                                                    <div style={{ 
                                                        padding: "20px 24px", 
                                                        background: "#f0fdf4", 
                                                        borderRadius: "12px", 
                                                        border: "1px solid #bbf7d0",
                                                        position: "relative"
                                                    }}>
                                                        <div style={{
                                                            position: "absolute",
                                                            top: "-10px",
                                                            left: "24px",
                                                            background: "#22c55e",
                                                            width: "20px",
                                                            height: "20px",
                                                            borderRadius: "50%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "12px"
                                                        }}>✓</div>
                                                        <p style={{ 
                                                            color: "#166534", 
                                                            fontSize: "15px", 
                                                            margin: 0, 
                                                            lineHeight: "1.7"
                                                        }}>
                                                            {reponse.message}
                                                        </p>
                                                    </div>
                                                </div>
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