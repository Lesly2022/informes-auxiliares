export default function Footer() {
  return (
    <footer
      className="no-print px-6 py-4 text-center"
      style={{
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
      }}
    >
      <p
        className="text-xs"
        style={{ color: '#5a6a82' }}
      >
        © 2026 SILAB – Sistema de Informes de Laboratorio
      </p>

      <p
        className="text-xs mt-1"
        style={{ color: '#8fa0b8' }}
      >
        Departamento de Informática y Sistemas · UMSS · Todos los derechos reservados.
      </p>
    </footer>
  );
}