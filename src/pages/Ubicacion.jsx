import React from "react";
import "../style/Ubicacion.scss";

const Ubicacion = () => {
  return (
    <div className="ubicacion-container">
  <h1>Nuestras Ubicaciones</h1>

  <div className="map-container">
    <h2>Sucursal Centro</h2>
    <iframe
      title="Sucursal Centro"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.652282461468!2d-106.07938272377115!3d28.640181775660675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86ea43a0012dfd1b%3A0x32834a2dd42fff71!2sBamboo%20Cuu!5e0!3m2!1sen!2smx!4v1759105198073!5m2!1sen!2smx"
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>

  <div className="map-container">
    <h2>Sucursal Sur</h2>
    <iframe
      title="Sucursal Sur"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.701823200197!2d-105.99409092377023!3d28.66864547564502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86ea452db7246893%3A0x7b369c7455705f91!2sBamboo%20Cuu!5e0!3m2!1sen!2smx!4v1759106849264!5m2!1sen!2smx"
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
</div>
  );
};

export default Ubicacion;
