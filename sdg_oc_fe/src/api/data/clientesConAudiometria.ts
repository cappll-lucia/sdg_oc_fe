import type { ClienteConAudiometria } from "../entities/entities";

export const clientesConAudiometria: ClienteConAudiometria[] =  [
  {
    id: 1,
    dni: "12345678",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@example.com",
    sexo: "Masculino",
    telefono: "1123456789",
    domicilio: "Calle Falsa 123",
    fechaNac: new Date("1985-05-15"),
    observaciones: "Cliente con historial de pérdida auditiva leve.",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-12-01T00:00:00.000Z",
    audiometrias: [
      {
        id: 1,
        pdfUrl: "/pdf/ej_audiometria.pdf",
        observaciones: "Audiometría realizada en 2023. Resultados dentro de lo normal.",
        fechaInforme: new Date("2023-01-15"),
        createdAt: "2023-01-15T00:00:00.000Z",
        updatedAt: "2023-12-01T00:00:00.000Z"
      },
      {
        id: 2,
        pdfUrl: "/pdf/ej_audiometria.pdf",
        observaciones: "Audiometría realizada en 2022. Indicios de pérdida auditiva leve en el oído izquierdo.",
        fechaInforme: new Date("2022-01-15"),
        createdAt: "2022-01-15T00:00:00.000Z",
        updatedAt: "2022-12-01T00:00:00.000Z"
      }
    ]
  },
  {
    id: 2,
    dni: "87654321",
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@example.com",
    sexo: "Femenino",
    telefono: "1145678910",
    domicilio: "Av. Siempre Viva 742",
    fechaNac: new Date("1990-09-30"),
    observaciones: "Cliente sin antecedentes de pérdida auditiva.",
    createdAt: "2023-02-01T00:00:00.000Z",
    updatedAt: "2023-11-01T00:00:00.000Z",
    audiometrias: [
      {
        id: 3,
        pdfUrl: "/pdf/ej_audiometria.pdf",
        observaciones: "Audiometría realizada en 2023. Sin anomalías detectadas.",
        fechaInforme: new Date("2023-03-01"),
        createdAt: "2023-03-01T00:00:00.000Z",
        updatedAt: "2023-11-01T00:00:00.000Z"
      }
    ]
  },
  {
    id: 3,
    dni: "45678912",
    nombre: "Carlos",
    apellido: "Ramírez",
    email: "carlos.ramirez@example.com",
    sexo: "Masculino",
    telefono: "1134567890",
    domicilio: "Las Heras 456",
    fechaNac: new Date("1978-03-20"),
    observaciones: "Cliente con historial de tinnitus y miopía moderada",
    createdAt: "2022-05-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
    audiometrias: [
      {
        id: 4,
        pdfUrl: undefined,
        observaciones: "Audiometría realizada en 2023. Confirmación de tinnitus en ambos oídos.",
        fechaInforme: new Date("2023-04-01"),
        createdAt: "2023-04-01T00:00:00.000Z",
        updatedAt: "2023-10-01T00:00:00.000Z"
      },
      {
        id: 5,
        pdfUrl: "/pdf/ej_audiometria.pdf",
        observaciones: "Audiometría realizada en 2021. Resultados dentro de lo normal, pero con quejas de tinnitus.",
        fechaInforme: new Date("2021-03-01"),
        createdAt: "2021-03-01T00:00:00.000Z",
        updatedAt: "2021-12-01T00:00:00.000Z"
      }
    ]
  }
];