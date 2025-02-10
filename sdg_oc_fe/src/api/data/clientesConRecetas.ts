import {  ClienteConReceta } from "../entities";

export const clientesConReceta: ClienteConReceta[]=[
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
      recetasRecetados:[
        {
          id: 103,
          createdAt: "2024-12-10T08:30:00Z",
          updatedAt: "2024-12-10T09:00:00Z",
          fecha: new Date("2024-12-10T00:00:00-03:00"),
          oftalmologo: "Dr. Luis Martínez",
          tipo: "Anteojo Cerca",
          nro1: 5,
          nro2: 6,
          odEsf: -3.0,
          odCil: -1.5,
          odA: 170,
          oiEsf: -2.75,
          oiCil: -1.25,
          oiA: 160,
          dnp1: 28,
          dnp2: 29,
          diametro: 68,
          cristal: "Mineral",
          color: "Ámbar",
          armazon: "Acero Inoxidable",
          tratamiento: "Endurecido",
          observaciones: "Uso exclusivo para lectura."
        }
      ],
      historiaClinicaContacto: {
        id: 301,
        patologicos: true,
        traumaticos: false,
        sensLuzNatural: true,
        sensLuzArtificial: false,
        sensHumo: false,
        sensFrio: false,
        sensPolvo: true,
        observacionesSens: "Mayor sensibilidad al polvo y luz intensa.",
        trastornosNeurologicos: true,
        regimenEventual: false,
        glandulasEndocrinas: false,
        sistemaCardiovascular: true,
        embarazo: false,
        estomatologia: true,
        caries: false,
        digestivos: false,
        alergiaDigestiva: false,
        alergiaRespiratoria: false,
        alergiaCutanea: true,
        alergiaOtras: false,
        rinitisPrimaveral: true,
        sinusitisCronica: false,
        observacionesAntecedentes: "",
        antibioticos: false,
        antiestaminicos: false,
        piladoraContraceptiva: false,
        anorexigenos: false,
        neurolepticos: false,
        tratamientoDigestivo: false,
        diureticos: false,
        tranquilizantes: true,
        corticoides: false,
        porosimpaticoliticos: false,
        observacionesTratamientos: "Uso eventual de tranquilizantes para ansiedad.",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      recetasContacto: [
        {
          id: 202,
          createdAt: "2024-12-22T08:30:00Z",
          updatedAt: "2024-12-22T09:00:00Z",
          fecha: new Date("2024-12-22T00:00:00-03:00"),
          oftalmologo: "Dr. Laura Gómez",
          queratometriaOd1: 44.5,
          quetM1Od: 7.8,
          quetM2Od: 7.7,
          quetM1Oi: 7.9,
          quetM2Oi: 7.8,
          observacionQueratometria: "Curvatura regular.",
          parpado: true,
          maquillaje: false,
          tonicidad: true,
          hendiduraPalpebral: true,
          alturaPalpebral: true,
          buenParpadeoRitmo: true,
          buenParpadeoAmplitud: true,
          estesiometria: "normoestetico",
          odCb: 8.6,
          odEsferico: -3.25,
          odCilindrico: -1.25,
          odEje: 175,
          odDiametro: 14.0,
          oiCb: 8.5,
          oiEsferico: -2.75,
          oiCilindrico: -1.00,
          oiEje: 160,
          oiDiametro: 14.1,
          marca: "Acuvue",
          observaciones: "Prueba inicial con buenos resultados.",
          pruebas: [
            {
              id: 401,
              idRecetaLentesContacto: 202,
              numeroPrueba: 1,
              odDiametro: 14.0,
              odEje: 175,
              odCilindrico: -1.25,
              odEsferico: -3.25,
              odCb: 8.6,
              oiDiametro: 13.8,
              oiEje: 158,
              oiCilindrico: -1.75,
              oiEsferico: -2.00,
              oiCb: 8.5,
              createdAt: "2024-12-22T08:45:00Z",
              updatedAt: "2024-12-22T08:45:00Z",
            },
            {
              id: 402,
              idRecetaLentesContacto: 202,
              numeroPrueba: 2,
              odDiametro: 14.1,
              odEje: 160,
              odCilindrico: -1.00,
              odEsferico: -2.75,
              odCb: 8.5,
              oiDiametro: 16.1,
              oiEje: 173,
              oiCilindrico: -0.50,
              oiEsferico: -1.50,
              oiCb: 6.7,
              createdAt: "2024-12-22T08:50:00Z",
              updatedAt: "2024-12-22T08:50:00Z",
            },
          ],
        },
        {
          id: 203,
          createdAt: "2024-12-23T08:30:00Z",
          updatedAt: "2024-12-23T09:00:00Z",
          fecha: new Date("2024-12-23T00:00:00-03:00"),
          oftalmologo: "Dr. Laura Gómez",
          queratometriaOd1: 43.0,
          quetM1Od: 7.9,
          quetM2Od: 7.8,
          quetM1Oi: 8.0,
          quetM2Oi: 7.9,
          observacionQueratometria: "Curvatura ligeramente irregular.",
          parpado: true,
          maquillaje: false,
          tonicidad: true,
          hendiduraPalpebral: true,
          alturaPalpebral: true,
          buenParpadeoRitmo: true,
          buenParpadeoAmplitud: true,
          estesiometria: "hipoestetico",
          odCb: 8.6,
          odEsferico: -3.50,
          odCilindrico: -1.50,
          odEje: 170,
          odDiametro: 14.0,
          oiCb: 8.4,
          oiEsferico: -2.50,
          oiCilindrico: -1.25,
          oiEje: 160,
          oiDiametro: 14.1,
          marca: "Biofinity",
          observaciones: "Receta secundaria para monitoreo.",
          pruebas: [],
        },
      ],
    } ,
    {
      id: 7,
      telefono: "3424321234",
      domicilio: "Av. Pellegrini 750",
      fechaNac: new Date( "1993-06-18T00:00:00-03:00"),
      sexo: "M",
      dni: "33445566",
      nombre: "Diego",
      apellido: "Rodríguez",
      observaciones: "Cliente recurrente",
      email: "diego.rodriguez@example.com",
      createdAt: "*",
      updatedAt:"*",
      recetasRecetados:[
      {
        id: 104,
        createdAt: "2024-11-20T15:00:00Z",
        updatedAt: "2024-11-20T15:30:00Z",
        fecha: new Date("2024-11-20T00:00:00-03:00"),
        oftalmologo: "Dra. Andrea Salas",
        tipo: "Multifocal",
        nro1: 7,
        nro2: 8,
        odEsf: 1.0,
        odCil: 0.0,
        odA: 0,
        oiEsf: 1.25,
        oiCil: 0.0,
        oiA: 0,
        dnp1: 34,
        dnp2: 35,
        diametro: 74,
        cristal: "Policarbonato",
        color: "Transparente",
        armazon: "Titanio",
        tratamiento: "Antirreflejo",
        observaciones: "Uso diario para visión cercana y lejana."
      },
      {
        id: 105,
        createdAt: "2024-11-01T10:00:00Z",
        updatedAt: "2024-11-01T10:30:00Z",
        fecha: new Date("2024-11-01T00:00:00-03:00"),
        oftalmologo: "Dr. Martín Ríos",
        tipo: "Anteojo Lejos",
        nro1: 9,
        nro2: 10,
        odEsf: -1.25,
        odCil: -0.5,
        odA: 180,
        oiEsf: -1.0,
        oiCil: -0.25,
        oiA: 160,
        dnp1: 30,
        dnp2: 30,
        diametro: 70,
        cristal: "Orgánico",
        color: "Transparente",
        armazon: "Plástico",
        tratamiento: "Fotocromático",
        observaciones: "Usar al conducir o en actividades al aire libre."
      }
    ],
    historiaClinicaContacto: undefined, 
    recetasContacto:[]
    },
    {
      id: 11,
      telefono: "3416667777",
      domicilio: "Salta 567",
      fechaNac: new Date( "1990-03-15T00:00:00-03:00"),
      sexo: "M",
      dni: "44556677",
      nombre: "Santiago",
      apellido: "Méndez",
      observaciones: "Cliente con prescripción múltiple para actividades específicas.",
      email: "santiago.mendez@example.com",
      createdAt: "*",
      updatedAt:"*",
      recetasRecetados:[
        {
          id: 201,
          createdAt: "2024-12-10T08:30:00Z",
          updatedAt: "2024-12-10T09:00:00Z",
          fecha: new Date("2024-12-10T00:00:00-03:00"),
          oftalmologo: "Dr. Emilio López",
          tipo: "Anteojo Lejos",
          nro1: 1,
          nro2: 2,
          odEsf: -2.5,
          odCil: -0.75,
          odA: 180,
          oiEsf: -2.0,
          oiCil: -0.5,
          oiA: 170,
          dnp1: 32,
          dnp2: 33,
          diametro: 70,
          cristal: "Policarbonato",
          color: "Transparente",
          armazon: "Metal",
          tratamiento: "Antirreflejo",
          observaciones: "Para uso cotidiano y conducción."
        },
        {
          id: 202,
          createdAt: "2024-11-15T11:00:00Z",
          updatedAt: "2024-11-15T11:30:00Z",
          fecha: new Date("2024-11-15T00:00:00-03:00"),
          oftalmologo: "Dra. Paula Gómez",
          tipo: "Anteojo Cerca",
          nro1: 3,
          nro2: 4,
          odEsf: -1.5,
          odCil: -0.25,
          odA: 90,
          oiEsf: -1.25,
          oiCil: 0.0,
          oiA: 80,
          dnp1: 28,
          dnp2: 29,
          diametro: 65,
          cristal: "Orgánico",
          color: "Transparente",
          armazon: "Plástico",
          tratamiento: "Endurecido",
          observaciones: "Lectura y trabajo en oficina."
        },
        {
          id: 203,
          createdAt: "2024-10-20T10:00:00Z",
          updatedAt: "2024-10-20T10:30:00Z",
          fecha: new Date("2024-10-20T00:00:00-03:00"),
          oftalmologo: "Dr. Carlos Herrera",
          tipo: "Multifocal",
          nro1: 5,
          nro2: 6,
          odEsf: -1.0,
          odCil: 0.0,
          odA: 0,
          oiEsf: -1.25,
          oiCil: -0.25,
          oiA: 10,
          dnp1: 30,
          dnp2: 31,
          diametro: 68,
          cristal: "Mineral",
          color: "Fotocromático",
          armazon: "Titanio",
          tratamiento: "UV400",
          observaciones: "Visión cercana y lejana."
        }
      ],
      historiaClinicaContacto: undefined, 
      recetasContacto:[]
    },

]