export const orderType = {
  name: 'order',
  title: 'Pedido',
  type: 'document',
  fields: [
    {
      name: 'reference',
      title: 'Referencia de Pago',
      type: 'string',
    },
    {
      name: 'userId',
      title: 'ID del Usuario',
      type: 'string',
    },
    {
      name: 'courseId',
      title: 'ID del Curso',
      type: 'string',
    },
    {
      name: 'studentName',
      title: 'Nombre del Estudiante',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Correo Electrónico',
      type: 'string',
    },
    {
      name: 'documentId',
      title: 'Documento de Identidad',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
    },
    {
      name: 'programName',
      title: 'Programa Académico',
      type: 'string',
    },
    {
      name: 'amount',
      title: 'Monto (Centavos)',
      type: 'number',
    },
    {
      name: 'status',
      title: 'Estado del Pago',
      type: 'string',
      options: {
        list: [
          { title: 'Pendiente', value: 'PENDING' },
          { title: 'Aprobado', value: 'APPROVED' },
          { title: 'Rechazado', value: 'DECLINED' },
          { title: 'Error', value: 'ERROR' }
        ],
        layout: 'radio'
      },
      initialValue: 'PENDING'
    },
    {
      name: 'wompiTransactionId',
      title: 'ID de Transacción Wompi',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'reference',
      subtitle: 'studentName',
      media: 'status',
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection
      return {
        title: `Ref: ${title}`,
        subtitle: `${subtitle} - ${media}`,
      }
    }
  }
}
