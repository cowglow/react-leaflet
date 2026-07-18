import type { Translations } from "ports/i18n/translations/en.ts";

const es: Translations = {
  common: {
    save: "Guardar",
    cancel: "Cancelar",
    close: "Cerrar",
    resize: "Cambiar tamaño",
    edit: "Editar",
    remove: "Eliminar",
    delete: "Eliminar",
    retry: "Reintentar",
  },
  organizationTypes: {
    Region: "Región",
    Headquarter: "Sede",
    Area: "Área",
    District: "Distrito",
  },
  layout: {
    title: "Visual Directory (Vite + React + TS)",
  },
  menu: {
    file: "Archivo",
    actions: "Acciones",
    view: "Ver",
    language: "Idioma",
    addOrganization: "Agregar organización",
    inviteAccount: "Invitar cuenta",
    organizations: "Organizaciones",
    systemCss: "system.css",
    sakunsTwitter: "Twitter de sakun",
    githubRepo: "Repositorio de GitHub",
  },
  auth: {
    signIn: "Iniciar sesión",
    email: "Correo electrónico",
    sendLoginLink: "Enviar enlace de acceso",
    linkSent:
      "Si esa dirección de correo tiene una cuenta, se ha enviado un enlace de acceso. Revise su bandeja de entrada (o la consola del servidor en desarrollo).",
    genericError: "Algo salió mal. Por favor, inténtelo de nuevo.",
    loading: "Cargando…",
    cantConnect: "No se pudo conectar",
  },
  connectionError: (message: string) => `No se pudieron cargar los datos: ${message}`,
  connectionErrorBanner: {
    retry: "Reintentar",
  },
  memberForm: {
    addTitle: "Agregar miembro",
    editTitle: "Editar miembro",
    noLocation:
      "No se seleccionó ninguna ubicación. Cierre esto y haga clic en el mapa para colocar un nuevo miembro.",
    firstName: "Nombre",
    lastName: "Apellido",
    street: "Calle",
    number: "Núm.",
    zip: "Código postal",
    city: "Ciudad",
    telephone: "Teléfono",
    email: "Correo electrónico",
    organization: "Organización",
    unassigned: "— Sin asignar —",
    lostContact: "Contacto perdido",
    lastKnownActive: "Última actividad conocida",
    saveFailed: "No se pudo guardar el miembro",
    removeFailed: "No se pudo eliminar el miembro",
    confirmRemoveTitle: "¿Eliminar miembro?",
    confirmRemoveMessage: (name: string) =>
      `¿Eliminar a ${name}? Esta acción no se puede deshacer.`,
  },
  organizationForm: {
    title: "Agregar organización",
    name: "Nombre",
    type: "Tipo",
    saveFailed: "No se pudo guardar la organización",
  },
  inviteForm: {
    title: "Invitar cuenta",
    email: "Correo electrónico",
    role: "Rol",
    roleMember: "Miembro (solo lectura)",
    roleLeader: "Líder (lectura y escritura)",
    linkToMember: "Vincular a una entrada del directorio",
    noMemberLink: "Ninguna",
    sendInvite: "Enviar invitación",
    invited: (email: string, role: string) =>
      `Se invitó a ${email} como ${role}. Ahora puede solicitar un enlace de acceso con ese correo.`,
    inviteFailed: "No se pudo enviar la invitación",
  },
  organizationTree: {
    title: "Organizaciones",
    empty: "Aún no hay organizaciones.",
    noMembers: "Sin miembros",
  },
  memberMarker: {
    active: "Activo",
    lostContactSince: (date: string) => `Contacto perdido desde ${date}`,
  },
  mapControls: {
    filterRange: "Rango de filtro",
    enable: "Activar",
    disable: "Desactivar",
    zoomControls: "Controles de zoom",
    mapLayerGroup: "Grupo de capas del mapa",
  },
  distanceControl: {
    distanceFrom: "Distancia desde",
    select: "— Seleccionar —",
    myLocation: "Mi ubicación",
    gettingLocation: "Obteniendo su ubicación…",
  },
  importExport: {
    exportLabel: "Exportar miembros como CSV",
    importLabel: "Importar miembros desde CSV",
    importResult: (imported: number, total: number, failed: number) =>
      `Se importaron ${imported} de ${total} miembros (${failed} fallaron — probablemente ya existían).`,
  },
};

export default es;
