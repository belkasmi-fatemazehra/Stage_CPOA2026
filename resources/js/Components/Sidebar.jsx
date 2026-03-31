import { useEffect, useState } from "react";

export default function Sidebar({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetch("/api/me", { credentials: "include" })
            .then(res => {
                if (res.ok) return res.json();
                return null;
            })
            .then(data => setCurrentUser(data))
            .catch(() => setCurrentUser(null));
    }, []);

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
            <div style={{
                width: "260px",
                background: "linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%)",
                color: "white",
                minHeight: "100vh",
                padding: "0",
                position: "fixed",
                height: "100vh",
                boxShadow: "4px 0 15px rgba(0,0,0,0.1)"
            }}>
                <div style={{
                    padding: "25px 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(0,0,0,0.2)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "45px",
                            height: "45px",
                            background: "white",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px"
                        }}>
                            🏛️
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Bureau d'Ordre</h3>
                            <p style={{ margin: 0, fontSize: "11px", opacity: 0.7 }}>Conseil Provincial</p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: "20px 15px" }}>
                    <p style={{ 
                        fontSize: "11px", 
                        textTransform: "uppercase", 
                        letterSpacing: "1px", 
                        opacity: 0.5,
                        marginBottom: "15px",
                        paddingLeft: "10px"
                    }}>Menu Principal</p>
                    
                    <NavButton href="/" icon="🏠" text="Accueil" />
                    <NavButton href="/courriers/create" icon="📥" text="Courrier Arrivée" />
                    <NavButton href="/courrier-departs/create" icon="📤" text="Courrier Départ" />
                    <NavButton href="/courriers" icon="📋" text="Liste Arrivée" />
                    <NavButton href="/courrier-departs" icon="📋" text="Liste Départ" />
                </div>

                {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
                    <div style={{ padding: "20px 15px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <p style={{ 
                            fontSize: "11px", 
                            textTransform: "uppercase", 
                            letterSpacing: "1px", 
                            opacity: 0.5,
                            marginBottom: "15px",
                            paddingLeft: "10px"
                        }}>Administration</p>
                        <NavButton href="/users" icon="⚙️" text="Gestion Utilisateurs" active />
                    </div>
                )}

                {currentUser?.role !== 'admin' && currentUser?.role !== 'manager' && (
                    <div style={{ padding: "20px 15px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <p style={{ 
                            fontSize: "11px", 
                            textTransform: "uppercase", 
                            letterSpacing: "1px", 
                            opacity: 0.5,
                            marginBottom: "15px",
                            paddingLeft: "10px"
                        }}>Mon Service</p>
                        <NavButton href="/affectations" icon="📌" text="Mes Affectations" active />
                    </div>
                )}

                {currentUser && (
                    <div style={{ 
                        position: "absolute", 
                        bottom: 0, 
                        width: "100%",
                        padding: "20px",
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(0,0,0,0.2)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                                width: "35px",
                                height: "35px",
                                background: "#3b82f6",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                                fontWeight: "bold"
                            }}>
                                {currentUser.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div style={{ overflow: "hidden" }}>
                                <p style={{ margin: 0, fontSize: "13px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name || "Utilisateur"}</p>
                                <p style={{ margin: 0, fontSize: "11px", opacity: 0.6, textTransform: "capitalize" }}>{currentUser?.role || "user"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ 
                flex: 1, 
                marginLeft: "260px",
                padding: "0"
            }}>
                {children}
            </div>
        </div>
    );
}

function NavButton({ href, icon, text, active }) {
    return (
        <a href={href} style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 15px",
            borderRadius: "8px",
            textDecoration: "none",
            color: "white",
            background: active ? "rgba(59, 130, 246, 0.3)" : "transparent",
            marginBottom: "5px",
            transition: "all 0.2s ease",
            fontSize: "14px",
            fontWeight: active ? "500" : "400"
        }}>
            <span style={{ fontSize: "18px" }}>{icon}</span>
            <span>{text}</span>
        </a>
    );
}