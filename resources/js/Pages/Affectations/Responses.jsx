import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";

export default function Responses() {
    const [reponses, setReponses] = useState([]);
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

        fetchReponses();
    }, []);

    const fetchReponses = () => {
        setLoading(true);
        fetch("/api/reponses/list", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setReponses(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setReponses([]);
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
                        padding: "25px 30px"
                    }}>
                        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "white" }}>
                            Réponses des Services
                        </h1>
                        <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.8, color: "white" }}>
                            Liste des réponses aux affectations
                        </p>
                    </div>

                    <div style={{ padding: "25px 30px" }}>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                                Chargement...
                            </div>
                        ) : reponses.length === 0 ? (
                            <div style={{ 
                                padding: "40px", 
                                background: "#f8fafc", 
                                borderRadius: "12px", 
                                textAlign: "center",
                                color: "#94a3b8"
                            }}>
                                📭 Aucune réponse pour le moment
                            </div>
                        ) : (
                            <div style={{ display: "grid", gap: "20px" }}>
                                {reponses.map((reponse) => (
                                    <div key={reponse.id} style={{
                                        background: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "12px",
                                        padding: "20px"
                                    }}>
                                        <div style={{ 
                                            display: "flex", 
                                            justifyContent: "space-between", 
                                            borderBottom: "1px solid #f1f5f9", 
                                            paddingBottom: "15px", 
                                            marginBottom: "15px" 
                                        }}>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                                    <span style={{
                                                        background: "#1e3a5f",
                                                        color: "white",
                                                        padding: "4px 12px",
                                                        borderRadius: "20px",
                                                        fontSize: "13px",
                                                        fontWeight: "600"
                                                    }}>
                                                        Courrier #{reponse.affectation?.courrier?.numero}/{reponse.affectation?.courrier?.annee}
                                                    </span>
                                                </div>
                                                <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>
                                                    <strong>Service:</strong> {reponse.affectation?.service?.nom_service}
                                                </p>
                                                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "5px 0 0 0" }}>
                                                    <strong>Répondu par:</strong> {reponse.user?.name}
                                                </p>
                                            </div>
                                            <span style={{ color: "#94a3b8", fontSize: "14px" }}>
                                                {new Date(reponse.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>

                                        {reponse.affectation?.message && (
                                            <div style={{ marginBottom: "15px" }}>
                                                <p style={{ 
                                                    fontSize: "12px", 
                                                    color: "#64748b", 
                                                    marginBottom: "8px",
                                                    textTransform: "uppercase",
                                                    fontWeight: "600"
                                                }}>
                                                    Message de l'admin :
                                                </p>
                                                <div style={{ 
                                                    padding: "12px 15px", 
                                                    background: "#eff6ff", 
                                                    borderRadius: "8px", 
                                                    border: "1px solid #bfdbfe",
                                                    color: "#1e40af",
                                                    fontSize: "14px"
                                                }}>
                                                    {reponse.affectation.message}
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ 
                                            padding: "15px", 
                                            background: "#dcfce7", 
                                            borderRadius: "8px", 
                                            border: "1px solid #bbf7d0" 
                                        }}>
                                            <p style={{ 
                                                fontSize: "12px", 
                                                color: "#15803d", 
                                                marginBottom: "8px",
                                                textTransform: "uppercase",
                                                fontWeight: "600"
                                            }}>
                                                Réponse du service :
                                            </p>
                                            <p style={{ color: "#166534", fontSize: "14px", margin: 0 }}>
                                                {reponse.message}
                                            </p>
                                        </div>
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