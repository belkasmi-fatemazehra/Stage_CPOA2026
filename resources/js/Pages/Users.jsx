import { useEffect, useState } from "react";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [natures, setNatures] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    Promise.all([
      fetch("/api/users-api").then(res => res.json()),
      fetch("/api/natures").then(res => res.json()),
      fetch("/api/services").then(res => res.json())
    ])
    .then(([usersData, naturesData, servicesData]) => {
      setUsers(usersData);
      setNatures(naturesData);
      setServices(servicesData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Erreur:", err);
      setLoading(false);
    });

  }, []);

  const updateUser = (u) => {

    fetch(`/api/users/${u.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: u.name,
        email: u.email,
        role: u.role,
        is_active: u.is_active,
        service: u.service,
        nature_id: u.nature_id
      })
    })
      .then(res => res.json())
      .then(() => {
        alert("Utilisateur modifié avec succès");
      })
      .catch(() => {
        alert("Erreur modification");
      });

  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: { bg: "#fef2f2", color: "#dc2626", text: "Admin" },
      manager: { bg: "#fef3c7", color: "#d97706", text: "Manager" },
      user: { bg: "#dbeafe", color: "#2563eb", text: "User" }
    };
    const style = styles[role] || styles.user;
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600"
      }}>
        {style.text}
      </span>
    );
  };

  return (

    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "260px",
        background: "linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%)",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        position: "fixed",
        height: "100vh",
        boxShadow: "4px 0 20px rgba(0,0,0,0.15)"
      }}>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "30px",
          padding: "15px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "10px"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "white",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px"
          }}>
            🏛️
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600" }}>Bureau d'Ordre</h3>
            <p style={{ margin: 0, fontSize: "10px", opacity: 0.7 }}>Conseil Provincial</p>
          </div>
        </div>

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

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", marginTop: "20px" }}>
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
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, marginLeft: "260px", padding: "30px" }}>

        <div style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}>

          {/* HEADER */}
          <div style={{
            background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
            padding: "25px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600", color: "white" }}>
                Gestion des Utilisateurs
              </h1>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.8, color: "white" }}>
                Administrer les utilisateurs du système
              </p>
            </div>
            <div style={{ color: "white", fontSize: "14px" }}>
              Total: <strong>{users.length}</strong> utilisateurs
            </div>
          </div>

          {/* TABLE */}
          <div style={{ padding: "20px", overflowX: "auto" }}>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                Chargement...
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>

                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Utilisateur</th>
                    <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Email</th>
                    <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Role</th>
                    <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Service</th>
                    <th style={{ padding: "15px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Nature</th>
                    <th style={{ padding: "15px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Statut</th>
                    <th style={{ padding: "15px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {users.map(u => (

                    <tr key={u.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      
                      {/* USER */}
                      <td style={{ padding: "15px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            background: "#e0e7ff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#4f46e5",
                            fontWeight: "600",
                            fontSize: "14px"
                          }}>
                            {u.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <span style={{ fontWeight: "500", color: "#1f2937" }}>{u.name}</span>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td style={{ padding: "15px", color: "#6b7280", fontSize: "14px" }}>
                        {u.email}
                      </td>

                      {/* ROLE */}
                      <td style={{ padding: "15px" }}>
                        <select
                          value={u.role}
                          onChange={(e) => {
                            u.role = e.target.value;
                            setUsers([...users]);
                          }}
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "13px",
                            background: "white",
                            cursor: "pointer"
                          }}
                        >
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* SERVICE */}
                      <td style={{ padding: "15px" }}>
                        <select
                          value={u.service || ""}
                          onChange={(e) => {
                            u.service = e.target.value;
                            setUsers([...users]);
                          }}
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "13px",
                            background: "white",
                            minWidth: "140px",
                            cursor: "pointer"
                          }}
                        >
                          <option value="">--</option>
                          {services.map(s => (
                            <option key={s.id} value={s.nom_service}>
                              {s.nom_service}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* NATURE */}
                      <td style={{ padding: "15px" }}>
                        <select
                          value={u.nature_id || ""}
                          onChange={(e) => {
                            u.nature_id = e.target.value;
                            setUsers([...users]);
                          }}
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "13px",
                            background: "white",
                            cursor: "pointer"
                          }}
                        >
                          <option value="">--</option>
                          {natures.map(n => (
                            <option key={n.id} value={n.id}>
                              {n.nom}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* STATUT */}
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                            <input
                              type="radio"
                              checked={u.is_active}
                              onChange={() => {
                                u.is_active = true;
                                setUsers([...users]);
                              }}
                            />
                            <span style={{ color: "#059669", fontSize: "13px", fontWeight: "500" }}>Actif</span>
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                            <input
                              type="radio"
                              checked={!u.is_active}
                              onChange={() => {
                                u.is_active = false;
                                setUsers([...users]);
                              }}
                            />
                            <span style={{ color: "#dc2626", fontSize: "13px", fontWeight: "500" }}>Désactivé</span>
                          </label>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button
                          onClick={() => updateUser(u)}
                          style={{
                            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "none",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(34, 197, 94, 0.2)"
                          }}
                        >
                          ✓ Enregistrer
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

const btnStyle = {
  display: "block",
  width: "100%",
  marginBottom: "8px",
  padding: "12px",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "14px"
};

function NavButton({ href, icon, text, active }) {
  return (
    <a href={href} style={{
      ...btnStyle,
      background: active ? "rgba(59, 130, 246, 0.3)" : "transparent",
      fontWeight: active ? "500" : "400"
    }}>
      <span style={{ marginRight: "10px" }}>{icon}</span>
      {text}
    </a>
  );
}