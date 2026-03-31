import React, { useEffect, useState } from "react";
import { usePage } from '@inertiajs/react';

export default function Affectations() {
  const { auth } = usePage().props;
  const [affectations, setAffectations] = useState([]);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const serviceName = auth.user?.service;
    if (serviceName) {
      fetch(`/api/my-affectations?service_name=${encodeURIComponent(serviceName)}`)
        .then(res => res.json())
        .then(data => {
          setAffectations(data);
        });
    }
  }, [auth.user?.service]);

  const handleChange = (id, value) => {
    setMessages({
      ...messages,
      [id]: value
    });
  };

  const sendResponse = (id) => {
    fetch("/api/reponses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        affectation_id: id,
        message: messages[id]
      })
    })
    .then(res => res.json())
    .then(data => {
      alert("Réponse envoyée ✅");
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mes Affectations</h2>

      {affectations.length === 0 ? (
        <p>Aucune affectation</p>
      ) : (
        affectations.map(a => (
          <div key={a.id} style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px"
          }}>
            <p><b>Numéro:</b> {a.courrier.numero}</p>
            <p><b>Objet:</b> {a.courrier.objet}</p>

            <input
              type="text"
              placeholder="Votre réponse"
              value={messages[a.id] || ""}
              onChange={(e) => handleChange(a.id, e.target.value)}
              style={{ padding: "8px", width: "70%", marginRight: "10px" }}
            />

            <button onClick={() => sendResponse(a.id)}>
              Répondre
            </button>
          </div>
        ))
      )}
    </div>
  );
}